// 


const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = require('./app');
const db = require('./models');

// Port 5001 ensure karein (jaisa aapne setup kiya tha)
const PORT = process.env.PORT || 5001; 
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Production mein ise frontend URL se replace karein
    methods: ['GET', 'POST']
  }
});

// Helper function to calculate distance (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

// Memory Stores
const userSocketMap = new Map();
const activeUsers = new Map();
const activeAlerts = new Map();

// Helper to send clean data to frontend
function serializeActiveUsers() {
  return Object.fromEntries(
    Array.from(activeUsers.entries()).map(([userId, value]) => [
      userId,
      {
        userId: value.userId,
        name: value.name,
        lat: value.lat,
        long: value.long,
        updatedAt: value.updatedAt
      }
    ])
  );
}

function serializeActiveAlerts() {
  return Array.from(activeAlerts.values());
}

function bindUserSocket(userId, socketId) {
  if (!userId) return;
  const key = String(userId);
  if (!userSocketMap.has(key)) {
    userSocketMap.set(key, new Set());
  }
  userSocketMap.get(key).add(socketId);
}

function unbindUserSocket(userId, socketId) {
  if (!userId) return;
  const key = String(userId);
  const socketSet = userSocketMap.get(key);
  if (socketSet) {
    socketSet.delete(socketId);
    if (!socketSet.size) userSocketMap.delete(key);
  }

  const activeUser = activeUsers.get(key);
  if (activeUser && activeUser.sockets) {
    activeUser.sockets.delete(socketId);
    if (!activeUser.sockets.size) activeUsers.delete(key);
  }
}

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);
  
  const initialUserId = socket.handshake.auth?.userId;
  if (initialUserId) {
    bindUserSocket(initialUserId, socket.id);
    socket.data.userId = String(initialUserId);
  }

  // Handle SOS resolution (I Am Safe)
  socket.on('resolve-sos', ({ userId }) => {
    console.log(`SOS Resolved for user: ${userId}`);
    activeAlerts.delete(String(userId));
    io.emit('sos-resolved', { userId });
  });

  // Real-time Chat/Post sharing
  socket.on('share-post', (newPost) => {
    socket.broadcast.emit('new-post', newPost);
  });

  // Register user and send initial state
  socket.on('register-user', async ({ userId }) => {
    if (!userId) return;
    const key = String(userId);
    bindUserSocket(userId, socket.id);
    socket.data.userId = key;

    try {
      const user = await db.User.findByPk(userId);
      if (!user) return;

      const existing = activeUsers.get(key) || {
        userId: user.id,
        name: user.name,
        lat: user.last_lat,
        long: user.last_long,
        updatedAt: new Date().toISOString(),
        sockets: new Set()
      };
      existing.sockets.add(socket.id);
      activeUsers.set(key, existing);

      socket.emit('initial-state', {
        activeUsers: serializeActiveUsers(),
        activeAlerts: serializeActiveAlerts()
      });
      io.emit('active-users', serializeActiveUsers());
    } catch (err) {
      console.error("Registration error:", err);
    }
  });

  // Update live location
  socket.on('update-location', async ({ userId, lat, long }) => {
    try {
      if (!userId || lat == null || long == null) return;
      const key = String(userId);
      
      const user = await db.User.findByPk(userId);
      if (user) {
        await user.update({ last_lat: lat, last_long: long });
      }

      const existing = activeUsers.get(key) || {
        userId: userId,
        name: user ? user.name : "Unknown",
        sockets: new Set([socket.id])
      };
      existing.lat = lat;
      existing.long = long;
      existing.updatedAt = new Date().toISOString();
      activeUsers.set(key, existing);

      io.emit('active-users', serializeActiveUsers());
    } catch (err) {
      console.error("Location update error:", err);
    }
  });

  // TRIGGER SOS LOGIC (Fixed)
  socket.on('trigger-sos', async (data) => {
    try {
      const { lat, long, userId, userName } = data;
      console.log(`🚨 SOS RECEIVED from ${userName} (${userId}) at ${lat}, ${long}`);

      if (!lat || !long || !userId) {
        return socket.emit('sos-error', { message: 'Missing coordinates or userId' });
      }

      // 1. Database mein update karein
      const victim = await db.User.findByPk(userId);
      if (victim) {
        await victim.update({ last_lat: lat, last_long: long });
      }

      // 2. Alert record create karein
      const alert = await db.Alert.create({
        victim_id: userId,
        latitude: lat,
        longitude: long,
        status: 'active'
      });

      const payload = {
        alertId: alert.id,
        victimId: userId,
        victimName: userName || (victim ? victim.name : "Unknown"),
        victimLat: lat,
        victimLong: long,
        status: 'active'
      };

      // 3. Active alerts map mein save karein
      activeAlerts.set(String(userId), payload);

      // 4. Radius based broadcast (10km)
      activeUsers.forEach((userObj, id) => {
        if (id !== String(userId)) {
          const distance = getDistance(lat, long, userObj.lat, userObj.long);
          if (distance <= 10) {
            console.log(`Notifying nearby user: ${userObj.name} (${distance.toFixed(2)} km away)`);
            // Emit directly to that user's sockets if possible, or broadcast
            io.emit('new-alert', { ...payload, distance: distance.toFixed(2) });
          }
        }
      });

      socket.emit('sos-sent', { message: 'SOS successfully broadcasted', alertId: alert.id });

    } catch (err) {
      console.error("SOS Trigger Error:", err);
      socket.emit('sos-error', { message: 'Backend failed to process SOS' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    unbindUserSocket(socket.data.userId, socket.id);
    io.emit('active-users', serializeActiveUsers());
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});
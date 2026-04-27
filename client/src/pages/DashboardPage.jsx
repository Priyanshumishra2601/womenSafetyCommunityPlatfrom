// // import { useEffect, useMemo, useState } from 'react';
// // import { motion } from 'framer-motion';
// // import toast from 'react-hot-toast';
// // import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
// // import L from 'leaflet';
// // import 'leaflet-routing-machine'; // Import necessary for the Red Route
// // import { io } from 'socket.io-client';
// // import api from '../api/axios';
// // import { useAuth } from '../context/AuthContext';

// // // --- Custom Icons ---
// // const markerIcon = new L.Icon({
// //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41]
// // });

// // const policeIcon = new L.Icon({
// //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/2563/2563376.png', 
// //   iconSize: [35, 35],
// //   iconAnchor: [17, 35]
// // });

// // const alertIcon = L.divIcon({
// //   className: '',
// //   html: '<div class="blinking-alert-marker"></div>',
// //   iconSize: [22, 22],
// //   iconAnchor: [11, 11]
// // });

// // // --- Mock Data for Police Stations ---
// // const POLICE_STATIONS = [
// //   { name: "Police Station Sector 62", lat: 28.623, long: 77.367 },
// //   { name: "Alpha 1 Police HQ", lat: 28.471, long: 77.509 },
// //   { name: "Pari Chowk Police Post", lat: 28.467, long: 77.513 }
// // ];

// // // --- ROUTING ENGINE COMPONENT ---
// // function Routing({ from, to }) {
// //   const map = useMap();

// //   useEffect(() => {
// //     if (!map || !from || !to) return;

// //     // Drawing the Red Shortest Route
// //     const routingControl = L.Routing.control({
// //       waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
// //       lineOptions: {
// //         styles: [{ color: 'red', weight: 6, opacity: 0.9 }] 
// //       },
// //       addWaypoints: false,
// //       draggableWaypoints: false,
// //       fitSelectedRoutes: true,
// //       show: false // Keeps the UI clean from text directions
// //     }).addTo(map);

// //     return () => map.removeControl(routingControl);
// //   }, [map, from, to]);

// //   return null;
// // }

// // function AutoPanMap({ coords, target }) {
// //   const map = useMap();
// //   useEffect(() => {
// //     if (target?.lat && target?.long) {
// //       map.flyTo([target.lat, target.long], 16, { duration: 1.5 });
// //     }
// //   }, [target, map]);
// //   return null;
// // }

// // function haversineDistanceKm(lat1, lon1, lat2, lon2) {
// //   const toRad = (v) => (v * Math.PI) / 180;
// //   const R = 6371;
// //   const dLat = toRad(lat2 - lat1);
// //   const dLon = toRad(lon2 - lon1);
// //   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// // }

// // export default function DashboardPage() {
// //   const { user, logout } = useAuth();
// //   const [coords, setCoords] = useState({ lat: 28.6139, long: 77.209 });
// //   const [activeAlerts, setActiveAlerts] = useState([]);
// //   const [mapFocus, setMapFocus] = useState(null); 
// //   const [posts, setPosts] = useState([]);
// //   const [postForm, setPostForm] = useState({ content: '', type: 'incident_report' });

// //   const socket = useMemo(() =>
// //     io('http://localhost:5001', { auth: { userId: user?.id } }), [user?.id]
// //   );

// //   useEffect(() => {
// //     socket.emit('register-user', { userId: user?.id, userName: user?.name, lat: coords.lat, long: coords.long });
    
// //     socket.on('new-alert', (payload) => {
// //       setActiveAlerts(prev => [payload, ...prev]);
// //       toast.error(`SOS ALERT: ${payload.victimName} needs help!`);
// //     });

// //     socket.on('new-post', (newPost) => setPosts(prev => [newPost, ...prev]));

// //     return () => socket.disconnect();
// //   }, [socket, user, coords]);

// //   useEffect(() => {
// //     api.get('/posts').then(res => setPosts(res.data)).catch(() => {});
// //     navigator.geolocation.getCurrentPosition(pos => {
// //       setCoords({ lat: pos.coords.latitude, long: pos.coords.longitude });
// //     });
// //   }, []);

// //   const triggerSos = () => {
// //     socket.emit('trigger-sos', { userId: user.id, userName: user.name, lat: coords.lat, long: coords.long });
// //     toast.success("SOS Broadcasted!");
// //   };

// //   const submitPost = async (e) => {
// //     e.preventDefault();
// //     if (!postForm.content.trim()) return;
// //     try {
// //       const res = await api.post('/posts', { ...postForm, latitude: coords.lat, longitude: coords.long });
// //       socket.emit('share-post', res.data);
// //       setPosts(prev => [res.data, ...prev]);
// //       setPostForm({ content: '', type: 'incident_report' });
// //     } catch (err) { toast.error("Failed to post"); }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
// //       <header className="h-16 w-full bg-slate-900 text-white flex items-center justify-between px-8 z-[2000]">
// //         <h1 className="text-2xl font-black italic uppercase">Safety Portal</h1>
// //         <div className="flex gap-4">
// //             <span className="text-xs self-center opacity-70">{user?.name}</span>
// //             <button onClick={logout} className="bg-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all">Logout</button>
// //         </div>
// //       </header>

// //       <div className="flex flex-1 overflow-hidden">
// //         {/* LEFT COLUMN: Feed */}
// //         <section className="w-[35%] flex flex-col border-r bg-white shadow-2xl z-20">
// //           <div className="p-5 border-b bg-slate-50 font-black text-xl uppercase tracking-tighter">Community Feed</div>
// //           <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
// //             <form onSubmit={submitPost} className="bg-slate-50 p-4 rounded-2xl border shadow-inner">
// //               <textarea 
// //                 value={postForm.content} 
// //                 onChange={e => setPostForm({...postForm, content: e.target.value})}
// //                 className="w-full text-lg p-3 rounded-xl border focus:ring-2 ring-red-100 resize-none"
// //                 placeholder="Describe emergency/incident..."
// //               />
// //               <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-2 hover:bg-black">SEND ALERT</button>
// //             </form>

// //             <div className="space-y-4">
// //                 {posts.map(post => (
// //                 <div 
// //                     key={post.id} 
// //                     onClick={() => post.latitude && setMapFocus({ lat: post.latitude, long: post.longitude })}
// //                     className="p-4 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-red-400 transition-all shadow-sm group"
// //                 >
// //                     <div className="flex justify-between items-center mb-1">
// //                     <span className="font-black text-slate-800 uppercase text-sm">{post.author?.name}</span>
// //                     <span className="text-red-500 font-bold text-[9px] uppercase group-hover:underline">Click to Track</span>
// //                     </div>
// //                     <p className="text-slate-600 text-lg leading-tight font-medium">{post.content}</p>
// //                 </div>
// //                 ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* CENTER COLUMN: SOS Strip */}
// //         <section className="w-[150px] flex flex-col items-center justify-center bg-slate-50 border-x z-10">
// //           <motion.button 
// //             onClick={triggerSos}
// //             whileTap={{ scale: 0.9 }}
// //             className="h-28 w-28 bg-red-600 rounded-full border-[6px] border-white shadow-[0_10px_30px_rgba(220,38,38,0.5)] flex items-center justify-center text-white font-black text-2xl"
// //           >
// //             SOS
// //           </motion.button>
          
// //           <button 
// //             onClick={() => setMapFocus(null)}
// //             className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-300 pb-1"
// //           >
// //             Clear Route
// //           </button>
// //         </section>

// //         {/* RIGHT COLUMN: Map */}
// //         <section className="flex-1 relative">
// //           <MapContainer center={[coords.lat, coords.long]} zoom={14} className="h-full w-full">
// //             <AutoPanMap target={mapFocus} />
// //             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
// //             {/* My Location */}
// //             <Marker position={[coords.lat, coords.long]} icon={markerIcon}><Popup>You are here</Popup></Marker>

// //             {/* ROUTE MARKING */}
// //             {mapFocus && <Routing from={[coords.lat, coords.long]} to={[mapFocus.lat, mapFocus.long]} />}

// //             {/* Police Stations */}
// //             {POLICE_STATIONS.map((station, i) => (
// //               <Marker key={i} position={[station.lat, station.long]} icon={policeIcon}>
// //                  <Popup>
// //                     <div className="text-center">
// //                         <p className="font-black uppercase text-xs">{station.name}</p>
// //                         <p className="text-blue-600 font-bold text-[10px]">Dist: {haversineDistanceKm(coords.lat, coords.long, station.lat, station.long).toFixed(1)} KM</p>
// //                     </div>
// //                  </Popup>
// //               </Marker>
// //             ))}

// //             {/* Victims from Posts */}
// //             {posts.map(post => post.latitude && (
// //               <Marker key={post.id} position={[post.latitude, post.longitude]} icon={alertIcon}>
// //                 <Popup>Incident Reported by {post.author?.name}</Popup>
// //               </Marker>
// //             ))}
// //           </MapContainer>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useMemo, useState } from 'react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet-routing-machine'; 
// import { io } from 'socket.io-client';
// import api from '../api/axios';
// import { useAuth } from '../context/AuthContext';

// // Icons for better UI
// const markerIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// const policeIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/2563/2563376.png', 
//   iconSize: [35, 35],
//   iconAnchor: [17, 35]
// });

// const alertIcon = L.divIcon({
//   className: '',
//   html: '<div style="width:20px; height:20px; background:red; border-radius:50%; border:2px solid white; box-shadow:0 0 10px red;" class="animate-pulse"></div>',
//   iconSize: [20, 20]
// });

// const POLICE_STATIONS = [
//   { name: "Noida Sector 62 Police Station", lat: 28.623, long: 77.367 },
//   { name: "Alpha 1 Police HQ", lat: 28.471, long: 77.509 },
//   { name: "Pari Chowk Post", lat: 28.467, long: 77.513 }
// ];

// // --- Sub Components ---
// function Routing({ from, to }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!map || !from || !to) return;
//     const routingControl = L.Routing.control({
//       waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
//       lineOptions: { styles: [{ color: 'red', weight: 6, opacity: 0.8 }] },
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       show: false 
//     }).addTo(map);
//     return () => map.removeControl(routingControl);
//   }, [map, from, to]);
//   return null;
// }

// function AutoPanMap({ target }) {
//   const map = useMap();
//   useEffect(() => {
//     if (target?.lat && target?.long) {
//       map.flyTo([target.lat, target.long], 16, { duration: 1.5 });
//     }
//   }, [target, map]);
//   return null;
// }

// function haversineDistanceKm(lat1, lon1, lat2, lon2) {
//   const toRad = (v) => (v * Math.PI) / 180;
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// export default function DashboardPage() {
//   const { user, logout } = useAuth();
//   const [stealthMode, setStealthMode] = useState(false);
//   const [coords, setCoords] = useState({ lat: 28.6139, long: 77.209 });
//   const [activeUsers, setActiveUsers] = useState({});
//   const [activeAlerts, setActiveAlerts] = useState([]);
//   const [mapFocus, setMapFocus] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [postForm, setPostForm] = useState({ content: '', type: 'incident_report' });

//   const socket = useMemo(() =>
//     io('http://localhost:5001', { auth: { userId: user?.id } }), [user?.id]
//   );

//   useEffect(() => {
//     if (!user?.id) return;
//     socket.emit('register-user', { userId: user.id, userName: user.name, lat: coords.lat, long: coords.long });
    
//     socket.on('new-alert', (p) => setActiveAlerts(prev => [p, ...prev]));
//     socket.on('new-post', (p) => setPosts(prev => [p, ...prev]));
//     socket.on('sos-resolved', ({ userId }) => setActiveAlerts(prev => prev.filter(a => String(a.victimId) !== String(userId))));

//     return () => socket.disconnect();
//   }, [socket, user, coords]);

//   useEffect(() => {
//     api.get('/posts').then(res => setPosts(res.data)).catch(console.error);
//     navigator.geolocation.getCurrentPosition(p => setCoords({ lat: p.coords.latitude, long: p.coords.longitude }));
//   }, []);

//   const triggerSos = () => socket.emit('trigger-sos', { userId: user.id, userName: user.name, lat: coords.lat, long: coords.long });
//   const resolveSos = () => {
//     socket.emit('resolve-sos', { userId: user.id });
//     setMapFocus(null);
//   };

//   const submitPost = async (e) => {
//     e.preventDefault();
//     if (!postForm.content.trim()) return;
//     const res = await api.post('/posts', { ...postForm, latitude: coords.lat, longitude: coords.long });
//     socket.emit('share-post', res.data);
//     setPosts(prev => [res.data, ...prev]);
//     setPostForm({ content: '', type: 'incident_report' });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
//       <header className="h-16 w-full bg-slate-900 text-white flex items-center justify-between px-4 md:px-8 shadow-2xl z-[2000] shrink-0">
//   {/* Left Side: Logo & Status */}
//   <div className="flex items-center gap-3">
//     <div className="h-3 w-3 md:h-4 md:w-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
//     <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Safety Portal</h1>
//   </div>
  
//   {/* Right Side: User Info + Logout */}
//   <div className="flex items-center gap-4 md:gap-6">
//     {/* Profile Info */}
//     <div className="flex flex-col items-end border-r border-slate-700 pr-4">
//       <span className="text-xs md:text-sm font-bold text-white uppercase tracking-tight">
//         {user?.name || "User"}
//       </span>
//       <span className="text-[8px] md:text-[10px] text-red-400 font-black uppercase tracking-widest">
//         {user?.role || "Member"}
//       </span>
//     </div>

//     {/* Single Logout Button */}
//     <button 
//       onClick={logout} 
//       className="bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-black px-4 md:px-6 py-2 md:py-2.5 rounded-xl transition-all shadow-lg active:scale-95 uppercase"
//     >
//       Logout
//     </button>
//   </div>
// </header>

//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
//         {/* LEFT: FEED */}
//         <section className="order-2 lg:order-1 w-full lg:w-[32%] flex flex-col bg-white border-r shadow-xl overflow-hidden">
//           <div className="p-4 border-b bg-slate-50 font-bold uppercase tracking-tight">Community Chat</div>
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             <form onSubmit={submitPost} className="bg-slate-50 p-3 rounded-2xl border">
//               <textarea value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full text-lg p-3 rounded-xl border-none focus:ring-0" placeholder="Type here..." rows={2} />
//               <button className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl mt-2">SEND</button>
//             </form>
//             {posts.map(post => (
//               <div key={post.id} onClick={() => post.latitude && setMapFocus({ lat: post.latitude, long: post.long || post.longitude })} className="p-4 bg-white border rounded-2xl cursor-pointer hover:border-red-400">
//                 <p className="font-black text-sm">{post.author?.name}</p>
//                 <p className="text-slate-600 text-lg leading-tight">{post.content}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* CENTER: SOS */}
//         <section className="order-1 lg:order-2 w-full lg:w-[150px] flex flex-row lg:flex-col items-center justify-center bg-slate-50 border-x p-4 gap-6 shrink-0">
//           <motion.button onClick={triggerSos} whileTap={{ scale: 0.9 }} className="h-24 w-24 bg-red-600 rounded-full border-4 border-white shadow-2xl text-white font-black text-xl">SOS</motion.button>
//           <button onClick={resolveSos} className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">✓</button>
//         </section>

//         {/* RIGHT: MAP */}
//         <section className="order-3 lg:order-3 flex-1 relative min-h-[300px]">
//           <MapContainer center={[coords.lat, coords.long]} zoom={14} className="h-full w-full">
//             <AutoPanMap target={mapFocus} />
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <Marker position={[coords.lat, coords.long]} icon={markerIcon} />
//             {mapFocus && <Routing from={[coords.lat, coords.long]} to={[mapFocus.lat, mapFocus.long]} />}
//             {POLICE_STATIONS.map((s, i) => (
//               <Marker key={i} position={[s.lat, s.long]} icon={policeIcon}>
//                 <Popup><b>{s.name}</b><br/>{haversineDistanceKm(coords.lat, coords.long, s.lat, s.long).toFixed(1)} KM</Popup>
//               </Marker>
//             ))}
//             {activeAlerts.map(a => (
//               <Marker key={a.victimId} position={[Number(a.victimLat), Number(a.victimLong)]} icon={alertIcon}>
//                 <Popup><p className="text-red-600 font-bold">SOS: {a.victimName}</p></Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </section>
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine'; 
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// --- Leaflet Routing Machine CSS Fix ---
// Isse routing ke extra boxes hide ho jayenge
const style = document.createElement('style');
style.innerHTML = `.leaflet-routing-container { display: none !important; }`;
document.head.appendChild(style);

// Icons setup
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const policeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2563/2563376.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

const alertIcon = L.divIcon({
  className: '',
  html: '<div style="width:20px; height:20px; background:red; border-radius:50%; border:2px solid white; box-shadow:0 0 15px red;" class="animate-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const POLICE_STATIONS = [
  { name: "Noida Sector 62 Police Station", lat: 28.623, long: 77.367 },
  { name: "Alpha 1 Police HQ", lat: 28.471, long: 77.509 },
  { name: "Pari Chowk Post", lat: 28.467, long: 77.513 }
];

// --- Components ---
function Routing({ from, to }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !from || !to) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: { styles: [{ color: 'red', weight: 6, opacity: 0.8 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false 
    }).addTo(map);
    return () => map.removeControl(routingControl);
  }, [map, from, to]);
  return null;
}

function AutoPanMap({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target?.lat && target?.long) {
      map.flyTo([target.lat, target.long], 16, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [coords, setCoords] = useState({ lat: 28.6139, long: 77.209 });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [mapFocus, setMapFocus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ content: '', type: 'incident_report' });

  const socket = useMemo(() =>
    io('http://localhost:5001', { 
        auth: { userId: user?.id },
        transports: ['websocket'] 
    }), [user?.id]
  );

  useEffect(() => {
    if (!user?.id) return;
    
    // Registering user on mount
    socket.emit('register-user', { userId: user.id, userName: user.name, lat: coords.lat, long: coords.long });
    
    socket.on('initial-state', (data) => {
        setActiveAlerts(data.activeAlerts || []);
    });

    socket.on('new-alert', (p) => {
        setActiveAlerts(prev => [p, ...prev.filter(a => a.victimId !== p.victimId)]);
        toast.error(`SOS ALERT: ${p.victimName} is in danger!`, { duration: 6000 });
    });

    socket.on('new-post', (p) => setPosts(prev => [p, ...prev]));
    
    socket.on('sos-resolved', ({ userId }) => {
        setActiveAlerts(prev => prev.filter(a => String(a.victimId) !== String(userId)));
        toast.success("A person is now safe!", { icon: '✅' });
    });

    return () => {
        socket.off('new-alert');
        socket.off('new-post');
        socket.off('sos-resolved');
        socket.off('initial-state');
    };
  }, [socket, user, coords.lat, coords.long]);

  useEffect(() => {
    // Fetch posts from API
    api.get('/posts').then(res => setPosts(res.data)).catch(console.error);
    
    // Watch location real-time
    const watchId = navigator.geolocation.watchPosition(
        (p) => {
            const newCoords = { lat: p.coords.latitude, long: p.coords.longitude };
            setCoords(newCoords);
            socket.emit('update-location', { userId: user?.id, ...newCoords });
        },
        (err) => console.error("Location Error:", err),
        { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [user?.id, socket]);

  const triggerSos = () => {
    console.log("SOS Triggered by User:", user?.name);
    if (coords.lat && coords.long) {
        socket.emit('trigger-sos', { 
            userId: user.id, 
            userName: user.name, 
            lat: coords.lat, 
            long: coords.long 
        });
        toast.success("SOS Broadcasted to everyone nearby!", { icon: '🚨' });
    } else {
        toast.error("Location not found yet. Please wait.");
    }
  };

  const resolveSos = () => {
    socket.emit('resolve-sos', { userId: user.id });
    setMapFocus(null);
    toast.success("Marked yourself as safe.");
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!postForm.content.trim()) return;
    try {
        const res = await api.post('/posts', { ...postForm, latitude: coords.lat, longitude: coords.long });
        socket.emit('share-post', res.data);
        setPosts(prev => [res.data, ...prev]);
        setPostForm({ content: '', type: 'incident_report' });
        toast.success("Post Shared.");
    } catch (err) {
        toast.error("Post failed.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <header className="h-16 w-full bg-slate-900 text-white flex items-center justify-between px-4 md:px-8 shadow-2xl z-[2000] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 md:h-4 md:w-4 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Safety Portal</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-end border-r border-slate-700 pr-4">
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-tight">{user?.name || "User"}</span>
            <span className="text-[8px] md:text-[10px] text-red-400 font-black uppercase tracking-widest">{user?.role || "Member"}</span>
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-black px-4 md:px-6 py-2 rounded-xl transition-all shadow-lg active:scale-95 uppercase">Logout</button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* LEFT: FEED */}
        <section className="order-2 lg:order-1 w-full lg:w-[32%] flex flex-col bg-white border-r shadow-xl overflow-hidden">
          <div className="p-4 border-b bg-slate-50 font-bold uppercase tracking-tight text-slate-800">Community Feed</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <form onSubmit={submitPost} className="bg-slate-50 p-3 rounded-2xl border shadow-inner">
              <textarea value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full text-lg p-3 rounded-xl border-none focus:ring-0 bg-white" placeholder="Type an update..." rows={2} />
              <button className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl mt-2 hover:bg-black transition-all">POST ALERT</button>
            </form>
            {posts.map(post => (
              <div key={post.id} onClick={() => post.latitude && setMapFocus({ lat: post.latitude, long: post.long || post.longitude })} className="p-4 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-red-400 transition-all shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-black text-xs uppercase text-slate-900">{post.author?.name}</p>
                    <p className="text-[9px] font-bold text-blue-500 uppercase">Track on Map</p>
                </div>
                <p className="text-slate-600 text-lg leading-tight font-medium">{post.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CENTER: SOS STRIP */}
        <section className="order-1 lg:order-2 w-full lg:w-[150px] flex flex-row lg:flex-col items-center justify-center bg-slate-50 border-x p-4 gap-6 shrink-0">
          <motion.button onClick={triggerSos} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="h-24 w-24 bg-red-600 rounded-full border-[6px] border-white shadow-[0_10px_30px_rgba(220,38,38,0.5)] text-white font-black text-xl">SOS</motion.button>
          <button onClick={resolveSos} className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg font-black hover:bg-green-600">✓</button>
          <button onClick={() => setMapFocus(null)} className="hidden lg:block text-[9px] font-black text-slate-400 uppercase underline">Clear Route</button>
        </section>

        {/* RIGHT: MAP AREA */}
        <section className="order-3 lg:order-3 flex-1 relative min-h-[350px]">
          <MapContainer center={[coords.lat, coords.long]} zoom={14} className="h-full w-full">
            <AutoPanMap target={mapFocus} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={[coords.lat, coords.long]} icon={markerIcon}>
                <Popup><b>Your Location</b></Popup>
            </Marker>

            {mapFocus && <Routing from={[coords.lat, coords.long]} to={[mapFocus.lat, mapFocus.long]} />}
            
            {POLICE_STATIONS.map((s, i) => (
              <Marker key={i} position={[s.lat, s.long]} icon={policeIcon}>
                <Popup><div className="text-center font-bold"><b>{s.name}</b><br/><span className="text-blue-600">{haversineDistanceKm(coords.lat, coords.long, s.lat, s.long).toFixed(1)} KM</span></div></Popup>
              </Marker>
            ))}

            {activeAlerts.map(a => (
              <Marker key={a.victimId} position={[Number(a.victimLat), Number(a.victimLong)]} icon={alertIcon}>
                <Popup>
                    <div className="text-center">
                        <p className="text-red-600 font-black uppercase text-xs">Emergency: {a.victimName}</p>
                        <button onClick={() => setMapFocus({lat: a.victimLat, long: a.victimLong})} className="mt-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded">ROUTE TO VICTIM</button>
                    </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>
    </div>
  );

}









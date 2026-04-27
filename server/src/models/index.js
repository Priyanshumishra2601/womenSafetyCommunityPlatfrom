const fs = require('fs');
const path = require('path');

const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Sequelize model initialization pattern similar to sequelize-cli.
const db = {};

const modelsDir = __dirname;
for (const file of fs.readdirSync(modelsDir)) {
  if (file === 'index.js') continue;
  const modelFactory = require(path.join(modelsDir, file));
  if (typeof modelFactory !== 'function') continue;
  const model = modelFactory(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Associations
if (db.User && db.Alert) {
  db.User.hasMany(db.Alert, { foreignKey: 'victim_id', as: 'alertsAsVictim' });
  db.Alert.belongsTo(db.User, { foreignKey: 'victim_id', as: 'victim' });
}

if (db.User && db.EmergencyContact) {
  db.User.hasMany(db.EmergencyContact, { foreignKey: 'user_id', as: 'emergencyContacts' });
  db.EmergencyContact.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

if (db.User && db.CommunityPost) {
  db.User.hasMany(db.CommunityPost, { foreignKey: 'user_id', as: 'posts' });
  db.CommunityPost.belongsTo(db.User, { foreignKey: 'user_id', as: 'author' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


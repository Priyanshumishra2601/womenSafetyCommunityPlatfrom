module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define(
    'Alert',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      victim_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'resolved'),
        allowNull: false,
        defaultValue: 'active'
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'Alerts',
      timestamps: false
    }
  );

  return Alert;
};

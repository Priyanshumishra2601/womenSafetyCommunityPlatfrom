module.exports = (sequelize, DataTypes) => {
  const EmergencyContact = sequelize.define(
    'EmergencyContact',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      contact_name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      phone_number: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      tableName: 'EmergencyContacts',
      timestamps: false
    }
  );

  return EmergencyContact;
};

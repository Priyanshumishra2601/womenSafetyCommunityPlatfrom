module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('User', 'VerifiedHelper', 'Admin'),
        allowNull: false,
        defaultValue: 'User'
      },
      last_lat: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      last_long: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'Users',
      timestamps: false
    }
  );

  return User;
};

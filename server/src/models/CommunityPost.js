module.exports = (sequelize, DataTypes) => {
  const CommunityPost = sequelize.define(
    'CommunityPost',
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('safety_tip', 'incident_report'),
        allowNull: false
      },
      location_tag: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
      }
    },
    {
      tableName: 'CommunityPosts',
      timestamps: false
    }
  );

  return CommunityPost;
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('CommunityPosts', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('CommunityPosts', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('CommunityPosts', 'longitude');
    await queryInterface.removeColumn('CommunityPosts', 'latitude');
  }
};


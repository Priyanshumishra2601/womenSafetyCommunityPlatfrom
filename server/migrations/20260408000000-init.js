'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('User', 'VerifiedHelper', 'Admin'),
        allowNull: false,
        defaultValue: 'User'
      },
      last_lat: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      last_long: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });

    // Alerts
    await queryInterface.createTable('Alerts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      victim_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'resolved'),
        allowNull: false,
        defaultValue: 'active'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // EmergencyContacts
    await queryInterface.createTable('EmergencyContacts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      contact_name: {
        type: Sequelize.STRING(120),
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING(30),
        allowNull: false
      }
    });

    // CommunityPosts
    await queryInterface.createTable('CommunityPosts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('safety_tip', 'incident_report'),
        allowNull: false
      },
      location_tag: {
        type: Sequelize.STRING(100),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CommunityPosts');
    await queryInterface.dropTable('EmergencyContacts');
    await queryInterface.dropTable('Alerts');
    await queryInterface.dropTable('Users');
  }
};


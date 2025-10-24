'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      familyName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      totalYearsExperience: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      appliedRole: {
        type: Sequelize.STRING,
        allowNull: false
      },
      overallScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      recommendation: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      onboardingStage: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'new'
      },
      rawData: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      evaluation: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('candidates');
  }
};
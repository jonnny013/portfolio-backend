'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.Sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true,
          },
          password_hash: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          account_status: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      )
      await queryInterface.createTable('emails', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        subject: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        sender_info: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      })
      await queryInterface.createTable(
        'projects',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          title: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true,
          },
          project: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          website: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          source_code: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          skills: {
            type: Sequelize.JSONB,
          },
          recommended: {
            type: Sequelize.BOOLEAN,
          },
          image: {
            type: Sequelize.TEXT,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      )
      await queryInterface.createTable(
        'about_me_posts',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          pic_desc: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          type: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          picture: {
            type: Sequelize.TEXT,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      )
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('users', { transaction })
      await queryInterface.dropTable('emails', { transaction })
      await queryInterface.dropTable('projects', { transaction })
      await queryInterface.dropTable('about_me_posts', { transaction })
    })
  },
}

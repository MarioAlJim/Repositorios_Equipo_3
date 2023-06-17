const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 15]
            }
        },
        
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [64, 64]
            }
        },

        otp: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 6]
            }
        },

        active: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };

    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let user = sequelize.define('user', fields, options);

    let person = sequelize.models.person;
    person.hasOne(user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    user.belongsTo(person);

    return user;
};

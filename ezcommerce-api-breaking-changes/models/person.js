const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        
        paternalSurname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        
        maternalSurname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },

        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [7, 15]
            }
        }
    };

    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let model = sequelize.define('person', fields, options);

    return model;
};
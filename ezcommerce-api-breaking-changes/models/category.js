const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        }
    };

    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let model = sequelize.define('category', fields, options);

    return model;
};
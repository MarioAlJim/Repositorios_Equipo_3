const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        productModel: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 50]
            }
        },

        price : {
            type: DataTypes.DOUBLE,
            allowNull: false
        }, 

        size : {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    };

    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let model = sequelize.define('product', fields, options);

    model.belongsTo(sequelize.models.brand, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    model.belongsTo(sequelize.models.category, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    return model;
};
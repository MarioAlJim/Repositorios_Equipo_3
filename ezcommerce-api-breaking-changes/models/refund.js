const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        status:{
                type: DataTypes.INTEGER,
                allowNull: false
        },

        reason: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [20, 500]
            }
        },

        requestDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
    
    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let refund = sequelize.define('refund', fields, options);

    let purchase = sequelize.models.purchase;
    purchase.hasOne(refund, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    refund.belongsTo(purchase);

    return refund;
};
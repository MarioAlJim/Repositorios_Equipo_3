const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    let fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    };

    let options = {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    };
        
    let purchase = sequelize.define('purchase', fields, options);

    let person = sequelize.models.person;
    person.hasOne(purchase, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    purchase.belongsTo(person);

    let paymentMethod = sequelize.models.paymentMethod;
    paymentMethod.hasOne(purchase, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });
    purchase.belongsTo(paymentMethod);

    let product = sequelize.models.product;
    product.hasOne(purchase, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    purchase.belongsTo(product);

    return purchase;
};

const sequelize = require('../../config/sequelize');
const {Sequelize, DataTypes} = require('sequelize');

const Products  = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    image_url: {
        type: DataTypes.TEXT 
    }
});

module.exports = Products;

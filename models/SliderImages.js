const Sequelize = require('sequelize');
const db = require('../config/database');


const SliderImages  = db.define('SliderImages', {
    // attributes
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    SerialNumber: {
        type: Sequelize.STRING,
        allowNull:false
    },
    id: {
        type:Sequelize.NUMBER,
        allowNull:false
    }

});

module.exports = SliderImages;

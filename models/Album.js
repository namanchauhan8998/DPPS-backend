const Sequelize = require('sequelize');
const db = require('../config/database');


const Album  = db.define('albums', {
    // attributes
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(1024),
        allowNull:false
    },
    coverImage:{
        type:Sequelize.STRING,
        allowNull:false
    },
    uploadedBy: {
        type: Sequelize.STRING,
        allowNull:false
    },

});

module.exports = Album;

const Sequelize = require('sequelize');
const db = require('../config/database');

const Marquee= db.define('marquee',{
    text:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    UploadedBy:{
        type:Sequelize.STRING,
        allowNull: false,
    }
});

module.exports= Marquee;
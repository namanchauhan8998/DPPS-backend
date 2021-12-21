const Sequilize= require('sequelize')
const db=require('../config/database')
const Assignments=db.define('assignment',{
    Standard:{
        type:Sequilize.INTEGER,
        nullable:false,
    },
    Section:{
        type:Sequilize.CHAR,
        nullable:false
    },
    Subject:{
      type:Sequilize.STRING,
        nullable:true
    },
    link:{
        type:Sequilize.STRING,
        nullable:true,
    },
    date:{
        type:Sequilize.DATEONLY,
        nullable:true
    },
    uploadedBy: {
        type:Sequilize.STRING,
        nullable:true
    }

})
module.exports=Assignments;
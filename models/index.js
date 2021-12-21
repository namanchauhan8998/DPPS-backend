const Album = require('./Album')
const Photo = require('./Photo')
const User = require('./User')
const Marquee=require('./Marquee')
const Announcements =require('./Announcements')
const Assignments=require('./Assignments')
// const AnnouncementFiles=require('./AnnouncementsFiles')



//Add Associations here
Album.hasMany(Photo,{ foreignKey: 'albumId', onDelete: 'CASCADE' })
//Announcements.hasMany(AnnouncementFiles,{foreignKey:{allowNull:false},onDelete:'CASCADE'})


// module.exports = {Album,Photo,User,Marquee,Announcements,AnnouncementFiles}
module.exports = {User,Marquee,Announcements,Album,Photo}









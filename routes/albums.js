const express = require('express')
const router = express.Router();

const Album = require('../models/Album');
const Photo = require('../models/Photo');
const s3 = require('../config/s3');
const checkAuth = require('../middleware/check-auth');

//create album
router.post('/create', checkAuth,(req,res,next)=>{
    new Album({
        title:req.body.title,
        description: req.body.description,
        coverImage:'',
        uploadedBy: req.body.uploadedBy,
    })
        .save()
        .then((album)=>{
            if(!album)res.status(400).json({message:'Invalid input'});
            res.status(201).json({message:'Album Successfully Created!',album:album.id})})
        .catch(err=>{next(err)})
});

router.delete('/delete/:albumId', checkAuth,(req,res,next)=>{
    Photo.findAll({where:{albumId:req.params.albumId}}).then(photos=>{
        photos.map(photo=>{
            const params = {Bucket: 'bbpsipbucket', Key: photo.storageId};
            console.log("Photo key ",photo.storageId,"-->")
            s3.deleteObject(params, (err, data)=>{
                if(err) next(err)
                 else photo.destroy();

            });
        })
    }).catch(err=>next(err));
    Album.destroy({where:{id:req.params.albumId}}).then(status=>{
        (status)?res.status(202).json({message:'Album Successfully deleted!'})
            :res.status(404).json({message:'Resource not found'})
    }).catch(err=>next(err))
})

router.get('/all', (req,res,next)=>{
    const pageSize= parseInt(req.query.pageSize) ;
    const page = parseInt(req.query.page) ;
    Album
        .findAndCountAll({limit:pageSize || 10   ,offset:(page-1)*pageSize || 0})
        .then((albums)=>res.json({page:page,pageSize:albums.rows.length,totalItems:albums.count,albums:albums.rows}))
        .catch(err=>next(err))
});

router.get('/:id', (req,res,next)=>{
    Album
        .findByPk(req.params.id,{include:'photos'})
        .then(album=>{(album)?res.json(album):res.status(404).json({message:'No album found with given id'})})
        .catch(err=>next(err))
});

router.patch('/setCoverImage/:albumId',checkAuth,(req,res,next)=>{
    Album.update(
        { coverImage: req.body.coverImage },
        { where: { id: req.params.albumId } })
        .then((result)=>{
            (result===1)?res.status(200).json('Cover Image set successfully'):
                res.status(404).json('Album with given id was not found')
        })
        .catch(err =>next(err))
})



module.exports = router;


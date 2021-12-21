const express = require('express')
const router = express.Router();
const multer =require('multer')

const uuid=require('uuid')
const Photo = require('../models/Photo')
const Album  = require('../models/Album');
const s3 = require(   '../config/s3');
const checkAuth = require('../middleware/check-auth');


const storage =multer.memoryStorage({
    destination:function(req,file,callback){
        callback(null,'')
    },
})

const upload= multer({storage,limits:{fileSize:54288000}}).single('image')


router.post('/upload',checkAuth,upload,(req,res,next)=>{
    let albumId = req.query.albumId;
    if(!req.file)res.status(401).json({message:'Please include a file first!'})
    else{
        Album
            .findByPk(albumId)
            .then(album=>{
                console.log("Album id found!!")
                if(!album){res.status(404).json({message:'Album doesnt exist'})}
                else{
                    let myFile=req.file.originalname.split(".")
                    const fileType=myFile[myFile.length-1];
                    const params={
                        Bucket:'bbpsipbucket/Gallery',
                        Key: `${uuid.v4()}`,
                        Body: req.file.buffer,
                        ACL:'public-read'
                    };

                    s3.upload(params,(error,data)=>{
                        if(error){res.status(error.statusCode).json({message:error.message})}
                        else{
                            console.log("Arjun logs: Photo uploaded successfully!!")
                            new Photo({imageUrl:data.Location,storageId:data.Key,albumId:album.id})
                                .save()
                                .then((photo)=>{
                                    console.log("Arjun logs, photo added in db ")

                                    if(album.coverImage===''){
                                        album.update({coverImage:photo.imageUrl})
                                            .then(()=> {
                                            res.json({message:'Photo Uploaded Successfully!',photoId:photo.id})
                                        }).catch(err=>{
                                            console.log(err);
                                            next(err);
                                        });
                                    }
                                    else  res.json({message:'Photo Uploaded Successfully!',photoId:photo.id})


                                })
                                .catch(err=>{
                                    console.log({err})
                                    next(err.message)
                                })
                        }})
                }

            })
            .catch(err=>next(err))
    }

})

router.delete('/delete/:photoId',checkAuth,(req,res,next)=>{

    Photo
        .findByPk(req.params.photoId)
        .then(photo=>{
            if(!photo)res.status(400).json({message:'No such Photo Exists'})
            else{
                const params = {Bucket: 'bbpsipbucket', Key: photo.storageId};
                s3.deleteObject(params, function(err, data) {
                    if(err){next(err)}
                    else photo
                        .destroy()
                        .then(()=>{res.json({message:'Photo was deleted!',data:data})})
                        .catch(err=>next(err))
                });
            }

        })
        .catch(err=>next(err))



});



module.exports = router;

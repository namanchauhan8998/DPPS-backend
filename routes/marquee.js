const express = require('express');
const router = express.Router();

const Marquee=require('../models/Marquee');
const checkAuth=require('../middleware/check-auth');

router.post('/NewMarquee',checkAuth,(req,res,next)=>{
    new Marquee({
        text:req.body.text,
        UploadedBy:req.body.UploadedBy,
    })
        .save()
        .then(res.status(200).json({message:'Marquee added successfully'}))
        .catch(err=>{next(err)})
});

router.get('/all',(req,res,next)=>{
    Marquee
        .findAll()
        .then(marquee=>{(marquee)?res.json(marquee):res.status(200).json({message:'Marquee found'})})
        .catch(err=>next(err))
});
router.get('/test',(req,res,next)=>{
res.send('pong');
});

router.delete('/delete/:marqueeId', checkAuth,(req,res,next)=>{
    Marquee.destroy({where:{id:req.params.marqueeId}}).then(
        status=>{
            (status)?res.status(202).json({message:'Marquee Successfully deleted!'})
                :res.status(404).json({message:'Resource not found'})
        }).catch(err=>next(err))
}
)


module.exports=router;


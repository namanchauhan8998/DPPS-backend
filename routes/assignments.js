const express=require('express')
const router=express.Router();
const Assignment=require('../models/Assignments');
const checkAuth=require('../middleware/check-auth');


//Creating an assignment
router.post('/NewAssignment',checkAuth,(req,res,next)=>{
    new Assignment
    ({
        Standard:req.body.Standard,
        Section:req.body.Section,
        link:req.body.link,
        date:req.body.date,
        uploadedBy:req.body.uploadedBy,
        Subject:req.body.Subject,
    }).save()
        .then((assignment)=>{
            if(!assignment)res.status(400).json({message:'Assignment not Created'});
            res.status(200).json({message:'Assignment created successfully!'})
        }).catch(err=>{next(err)})
    })


//Get All Assignments
router.get('/AllAssignments',((req, res, next) => {
    const pageSize= parseInt(req.query.pageSize) ;
    const page = parseInt(req.query.page) ;
    Assignment
        .findAndCountAll({limit:pageSize || 10   ,offset:(page-1)*pageSize || 0})
        .then((assignment)=>
            res.json({page:page,pageSize:assignment.rows.length,totalItems:assignment.count,Assignments:assignment.rows}))
        .catch(err=>next(err))
})
)

//Delete Assignment
router.delete('/deleteAssignment/:assignmentId',checkAuth,(req,res,next)=> {
    Assignment.destroy({where: {id: req.params.assignmentId}}).then(status => {
        (status) ? res.status(202).json({message: 'Assignment Successfully deleted!'})
            : res.status(404).json({message: 'Resource not found'})
    }).catch(err => next(err))
});


module.exports=router;
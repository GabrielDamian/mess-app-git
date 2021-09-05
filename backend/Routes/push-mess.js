const router  = require('express').Router();
const messageModel = require('../Models/message');

router.post('/', async(req, res)=>{
    let user_1_id = req.body.body.user_1_id;
    let user_2_id = req.body.body.user_2_id;
    let sender = req.body.body.sender;
    let content = req.body.body.content;


    try{
        let current_channel = await messageModel.findOne({
            $or:[
                {
                    user_1:user_1_id,
                    user_2:user_2_id
                },
                {
                    user_1:user_2_id,
                    user_2:user_1_id    
                }
        ]
        },)
        
        let old_messaged = current_channel.arr;
        old_messaged.push({
            sender: sender,
            content: content
        })
        try{
            let response_saved_mess = await messageModel.findOneAndUpdate({
                _id: current_channel._id
            },{
                arr: old_messaged
            })
            return res.json({
                message: "message saved successfully!"
            })
        }
        catch(err){
            return res.status(400).json({
                message: 'error while saving message in db!'
            })            
        }
        
    }
    catch(err)
    {
        return res.status(400).json({
            message: 'error while finding the channel!'
        })
    }

    res.json({
        message: 'inca se lucreaza!'
    })

})

module.exports = router;
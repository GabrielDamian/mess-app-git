const router = require('express').Router();
const userModel = require('../Models/user');
const messageModel = require('../Models/message');

router.post('/',async (req,res)=>{


    let heWants = req.body.body.iWant;
    switch(heWants)
    {
        //send _id and receive: name and profilePicUrl (if exists, else null)
        case 'name_profilePic':
            let id = req.body.body._id;
            let response = await userModel.findById(id);
            let foundedName=  response.name;
            let foundedProfilePic = response.profile_pic_url;
            return res.json({
                id: id,
                name: foundedName,
                profilePic: foundedProfilePic
            })
            
        case 'add-friend':
            let user_id = req.body.body.user_id;
            let friend_id = req.body.body.friend_id;

            //extract old friends
            let friends_temp = await userModel.findById(user_id);
            let friend_arr = friends_temp.friends;
            
            //verifica daca exista deja prietenul adaugat
            let friend_exists = false;
            friend_arr.forEach((el)=>{
                if(el == friend_id)
                {
                    friend_exists = true;
                }
            })
            if(friend_exists)
            {
                return res.status(400).json({message: 'friend already exists!'})
            }

            //verifica daca prietenul este un ID valid
            try{
                let target_friend = await userModel.findById(friend_id);

            }
            catch(err)
            {
                res.status(400).json({
                    message: 'this friend id is not valid!'
                })
            }
            //uerul nu exista in lista veche si este un id valid => se adauga pe lista veche
            //user -> adauga friend
            friend_arr.push(friend_id);
            let temp = await userModel.findOneAndUpdate({_id:user_id},{friends:[...friend_arr]})
            
            //friend -> adauga user
            let friend_id_model = await userModel.findById(friend_id);
            let friend_id_list = friend_id_model.friends;

            friend_id_list.push(user_id);
            let temp_friend_save = await userModel.findOneAndUpdate({_id:friend_id},{friends:[...friend_id_list]})
            

            //create channel between: user <=>friend in 'messages' collection
            //use `` for converting to string
            let newMessageChannel = new messageModel({
                user_1: `${user_id}`,
                user_2: `${friend_id}`,
                arr: []
            })
            let save_newMessChannel = await newMessageChannel.save();

            return res.json({
                success: 'true'
            })

        case 'update_avatar':
            let user_id_avatar = req.body.body._id;
            let new_avatar = req.body.body.new_avatar;
            try{
                let temp_user = await userModel.findOneAndUpdate({_id:user_id_avatar},{profile_pic_url:new_avatar})
                return res.json({
                    message: "avatar saved!"
                })
            }
            catch(err)
            {
                return res.status(400).json({
                    message: 'error while saving the new avatar'
                })
            }
        case 'get-messages':
            let user_1_mess = req.body.body.user_1;
            let user_2_mess = req.body.body.user_2;
            try{
                let old_messages_fetched = await messageModel.findOne({
                    $or:[
                        {
                            user_1:user_1_mess,
                            user_2:user_2_mess
                        },
                        {
                            user_1:user_2_mess,
                            user_2:user_1_mess    
                        }
                ]
                },)

                return res.json({
                    arr:old_messages_fetched.arr
                })
            }
            catch(err)
            {
                return res.status(400).json({
                    message: 'error while fetching the messages!'
                })
            }

        case 'friend_list':
            
            let user_friends_id = req.body.body._id;
            let friends_temp_1 = await userModel.findById(user_friends_id);
            //lista cu id-urile prietenilor
            let friend_stage_1 = friends_temp_1.friends;
            let final_arr = [];
            //pentru fiecare prieten, gaseste profile pic\



            if(friend_stage_1.length == 0)
            {
                return res.json({
                    arr: []
                })
            }
            else
            {
                for(let i=0;i<friend_stage_1.length;i++)
                {
                    let temp_friend = await userModel.findById(friend_stage_1[i]);
                    let temp_obj = {
                        friend_id: friend_stage_1[i],
                        friend_avatar: temp_friend.profile_pic_url,
                        friend_name: temp_friend.name
                    }
                    final_arr.push(temp_obj)
                }
                return res.json({
                    arr: final_arr
                })
            }


            return res.json({
                arr:final_arr
            })
            
        default: 
            return res.status(400).json({
                message: "No match in the iWant parameter!(You request something that server is not expecting to search for)"
            })
    }

})

module.exports = router;

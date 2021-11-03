const express = require('express')
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Pusher = require('pusher');
const msgModel = require('./Models/message');

//Import routers
const authRoute = require('./Routes/auth');
const access = require('./Routes/access');
const customRequest = require('./Routes/customRequest');
const pushMesage = require('./Routes/push-mess');

//app config
const cors = require('cors')
app.use(cors())

// app.use((req,res,next)=>{
//     res.setHeader("Acces-Control-Allow-Origin","*");
//     res.setHeader("Acces-Control-Allow-Headers","*");
//     next();
// })

dotenv.config();

const pusher = new Pusher({
    appId: "1260459",
    key: "aa8949b8b54f419e28a5",
    secret: "dd096bb763bbd2fb4d46",
    cluster: "eu",
    useTLS: true
  });

  //listener pe mongoose
const db = mongoose.connection
db.once('open',async ()=>{
    console.log("DB is connected!!!")
    const msgCollecton = db.collection("messages");
    const changeStream = msgCollecton.watch();
    changeStream.on('change',async (change)=>{
        console.log(change);
        if(change.operationType === 'update')
        {
            console.log('CHANGE!:', change)
            console.log('CALL PUSHER!')
            const doc_key= change.documentKey;
            console.log("Update in doc:", doc_key._id)
            let new_arr_data = change.updateDescription.updatedFields.arr;
            let new_pure_data = new_arr_data[new_arr_data.length-1];

            //find the users from the updated document
            try{
                let resp_temp = await msgModel.findById(doc_key._id);
                //console.log("TEST:",resp_temp) 
                let user_1_update = resp_temp.user_1;
                let user_2_update = resp_temp.user_2;
                console.log("User 1 2:", user_1_update, user_2_update)

                pusher.trigger('messages','inserted',{
                    user_1: user_1_update,
                    user_2: user_2_update,
                    new_msg: new_pure_data
                })
            }
            catch(err) 
            {
                console.log(err)
            }
        }
    })
})

let connect_to_mongose = async ()=>{
    try {
        let ceva_temp_obj = await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
}
connect_to_mongose();


//MiddleWare
app.use(express.json());



//Route MiddleWares
//anythin in authRoute will have '/api/user prefix => /api/user/register
app.use('/api/user',authRoute);
app.use('/api/access',access);
app.use('/api/custom-request',customRequest);
app.use('/api/push-mess', pushMesage);

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)
})
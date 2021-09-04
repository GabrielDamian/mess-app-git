const express = require('express')
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Pusher = require('pusher');

//Import routers
const authRoute = require('./Routes/auth');
const access = require('./Routes/access');
const customRequest = require('./Routes/customRequest');
const pushMesage = require('./Routes/push-mess');

//app config
const cors = require('cors')
app.use(cors())
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
db.once('open',()=>{
    console.log("DB is connected!!!")
    const msgCollecton = db.collection("messages");
    const changeStream = msgCollecton.watch();
    changeStream.on('change',(change)=>{
        console.log(change);
    })
})

let connect_to_mongose = async ()=>{
    try {
        let ceva_pola = await mongoose.connect(process.env.DB_CONNECT, {
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
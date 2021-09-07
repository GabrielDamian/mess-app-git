import React,{useState,useEffect} from 'react'
import './Chats.css';
import axios from 'axios';
import store from '../../../Redux/store';
import store_friends from '../../../ReduxFriends/store';
import DefaultUserIcon from '../../../images/default_user.png';

const Chats = () => {

    const [friends, setFriends] = useState(null);
    
    useEffect(()=>{
        store.subscribe(()=>{
            //pentru id-ul dat de store, vr inapoi array cu toti prietenii userului respectiv {name:, profile_pic};
            let user_id = store.getState().userID
            const config = {
                body:{
                    iWant: 'friend_list',
                    _id: user_id,
                }
            }
            axios.post('/api/custom-request',config)
            .then(resp=>{
                console.log("friends:", resp.data.arr)
                setFriends(resp.data.arr);
            })
           .catch((err)=>{
               console.log(err)
              
           })
            
        })
    },[])
    
    const [selectedFriend, setSelectedFriend] = useState(null);
    useEffect(()=>{
        store_friends.subscribe(()=>{
            setSelectedFriend(store_friends.getState().selectedFriend)
            console.log("Update in store friends!:", store_friends.getState())
        })
    },[])
    return (
        <div className="chats-container">
            {
                friends != null?
                friends.map((el)=>{
                    return(
                        <>
                        {selectedFriend == el.friend_id ? 
                        <PersonChatElem selected name={el.friend_name} avatar={el.friend_avatar} f_id={el.friend_id} lastActive={el.friend_lastActive}/> 
                        :
                        <PersonChatElem name={el.friend_name} avatar={el.friend_avatar} f_id={el.friend_id} lastActive={el.friend_lastActive}/> 
                        }
                        </>
                    )
                })
                :
                <p>No friends</p>
            }
        </div>
    )
}


const PersonChatElem = (props)=>{

    const setSelectedFriend = ()=>{
        store_friends.dispatch({
            type: 'update_selectedFriend',
            payload:{
                newFriendID: props.f_id,
                newFriend_name:props.name,
                newFriend_avatar: props.avatar
            }
        })
    }
    const decideLastActive = (lastActiveDate) =>{
        //primeste new Date().toString() 
        //converteste server time in local time 
        //verifica daca curentLocalTime > userLastActiveTime + offset => intoarce boolean
    
        let userServerTime = new Date(lastActiveDate);
        let currentDate = new Date();

        let userServeTimeSeconds = userServerTime.getTime()/1000;
        let currentTimeSeconds = currentDate.getTime()/1000;
        
        console.log("DIFERENTA:", currentTimeSeconds - userServeTimeSeconds)
        let diferenta = currentTimeSeconds - userServeTimeSeconds;

        //let userServerTime = lastActiveDate
        console.log("USER SERVER TIME: ", userServerTime);
        console.log("Current time: ", currentDate)

        if(diferenta <300)
        {
            return <p className="activeNow">Active</p>
        }
        else if(diferenta > 300 && diferenta < 3600)
        {
            return <p className="lastActive">{`Active ${parseInt(diferenta/60)}m ago.`}</p>
        }
        else 
        {
            return 'Active long time ago.'
        }

    }
    return(
        <div className={props.selected == true ? "person-chat-elem-container selected-chat" :"person-chat-elem-container"} onClick={setSelectedFriend}>
            <img src={props.avatar == null ? DefaultUserIcon:props.avatar } alt="user profile"/>
            <div className="person-char-data">
                <h5>{props.name}</h5>
                {decideLastActive(props.lastActive)}
            </div>
        </div>
    )
}
export default Chats

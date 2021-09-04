import React,{useState,useEffect} from 'react'
import './ProfileColumn.css';
import ProfileIcon from '../../../images/user.png';
import LogOutIcon from '../../../images/logout.png';
import store from '../../../Redux/store';
import axios from 'axios';
import DefaultUserIcon from '../../../images/default_user.png';
import { useHistory } from 'react-router';
const ProfileColumn = ({logOut}) => {
    const history = useHistory();

    const [userData, setUserData] = useState({
        userID: null,
        name: null,
        profilePic: null
    })
    useEffect(()=>{
        store.subscribe(()=>{
            let user_id = store.getState().userID
            //fetch cu request pe: (_id)=>(name,profile_pic)
            const config = {
                body:{
                    iWant: 'name_profilePic',
                    _id: user_id
                }
            }
            axios.post('/api/custom-request',config)
            .then(res=>{
                console.log("Custom request a primit inapoi:")
                console.log(res.data);
                setUserData((prev)=>{
                    return{
                        ...prev,
                        userID: res.data.id,
                        name: res.data.name,
                        profilePic: res.data.profilePic
                    }
                })
            })

        })
    },[])

    useEffect(()=>{
        console.log("Update in user data:", userData);
    },[userData])
    return (
        <div className="profileColumn-container">
            <div className="upper-profile-column">
                <div className="upper-profile-picture">
                    <img src={userData.profilePic == null ? DefaultUserIcon : userData.profilePic} alt="profile picture"/>
                </div>
                <div className="upper-profile-name">
                    <span>{userData.name == null ? 'Loading...':userData.name}</span>
                </div>
            </div>
            <div className="lower-profile-column">
                <div className="lower-profile-tab" onClick={()=>{history.push('/profile')}}>
                    <img src={ProfileIcon} alt="profileIcon"/>
                    <span>Profile</span>
                </div>
                <div className="lower-profile-tab" onClick={()=>{logOut()}}>
                    <img src={LogOutIcon} alt="logout"/>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileColumn

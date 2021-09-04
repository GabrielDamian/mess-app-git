import React,{useState, useEffect} from 'react'
import './Profile.css';
import store from '../../Redux/store';
import axios from 'axios';
import { useHistory } from 'react-router';
import DefaultUserIcon from '../../images/default_user.png';


const Profile = () => {

    const history = useHistory();

    const [haveAcces, setHaveAcces] = useState(false);
    useEffect(()=>{
        store.subscribe(()=>{
            console.log("store updated!:",store.getState())
        })
    })
    useEffect(()=>{
        const config = {
            headers:{
                'auth-token': localStorage.getItem('token')
            }
           
        }
        axios.get('/api/access',config)
            .then(res=>{
                console.log("aici",res);
                store.dispatch({
                    type: 'update_id',
                    payload:{
                        newID: res.data._id
                    }
                })
                setHaveAcces(true);
            })
            .catch((err)=>{console.log(err)})
    })

    const logOut = ()=>{
        localStorage.clear();
        history.push('/login')
    }
    return (
        <>
        {
            haveAcces == true ? <ProfileContent logOut={logOut}/> : <ProfileBlocked />
        }
        </>
    )
}

const ProfileContent = ({logOut})=>{

    const [userData, setUserData] = useState({
        userID: null,
        name: null,
        profilePic: null
    })
    const [friendID, setFriendID] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFriendInputChange = (e)=>{
        setFriendID(e.target.value);
        setShowError(false);
        setShowSuccess(false);
    }

    
    const addFriend = ()=>{
        setShowError(false);
        setShowSuccess(false);
        if(friendID != '' && userData.userID != null)
        {
            console.log("me:",userData.userID);
            console.log("friend:", friendID);
            const config = {
                body:{
                    iWant: 'add-friend',
                    user_id: userData.userID,
                    friend_id: friendID
                }
            }

            axios.post('/api/custom-request',config)
            .then(res=>{
                console.log(res)
                setShowSuccess(true);
                setFriendID('');

            })
            .catch((err)=>{
                console.log(err);
                setShowError(true);

            })
        }
        else
        {
            console.log("Error at adding a new friend!")
            setShowError(true);
            
        }
    }
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

    const [profilePicture, setProfilePicture] = useState('');

    const handleProfilePictureChange = (e)=>{
        setProfilePicture(e.target.value);
        setProfilePictureError(false);
        setProfilePictureSuccess(false);
    }
    const [profilePictureError, setProfilePictureError] = useState(false);
    const [profilePictureSuccess, setProfilePictureSuccess] = useState(false);

    const updateProfilePicture = (e)=>{
        if(profilePicture != '')
        {
            let user_id = store.getState().userID
            const config = {
                body:{
                    iWant: 'update_avatar',
                    _id: user_id,
                    new_avatar: profilePicture
                }
            }
            axios.post('/api/custom-request',config)
            .then(resp=>{
                setProfilePictureSuccess(true);
            })
           .catch((err)=>{
               console.log(err)
               setProfilePictureError(true);
           })
        }
        else
        {
            setProfilePictureError(true); 
        }
    }
    return(
        <div className="profile-container">
        {/* <button onClick={()=>{logOut()}}>Log out</button> */}
            <div className="profile-container-main">
                <div className="profile-container-upper">
                    <img src={userData.profilePic == null ? DefaultUserIcon : userData.profilePic} />
                    <span>{userData.name == null ? '' : userData.name}</span>
                </div>
                <div className="profile-container-lower">
                    <div className="profile-container-personal-data">
                        <span>Your ID: {userData.userID == null ? '':userData.userID}</span> 
                        <button className="profile-btn"> Copy</button>   
                    </div>
                    <div className="profile-container-add-friend">
                        <div className="profile-container-add-friend-title">
                            <span>Add friend 
                                {showError == true?<p className="error-true">Error at adding this friend ID </p> :null}
                                {showSuccess == true?<p className="success-true">Friend added successfully! </p> :null}
                                    
                            </span>    
                            
                        </div>
                        <div className="add-friend-input">
                            <input type="text" placeholder="Type new friend's ID here..." onChange={handleFriendInputChange} value={friendID}/>
                            <button className="profile-btn" onClick={addFriend}>Add friend</button>
                        </div>
                        

                    </div>
                    <div className="profile-container-add-friend">
                         <div className="profile-container-add-friend-title">
                            <span>Upload profile picture:
                            {profilePictureError == true?<p className="error-true">Can't save this url!</p>:null}  
                            {profilePictureSuccess == true?<p className="success-true">Avatar updated! Please refresh the page! </p> :null}
                            </span>  
                        </div>
                        <div className="add-friend-input">
                            <input type="text" placeholder="Paste photo's URL here..." onChange={handleProfilePictureChange} value={profilePicture}/>
                            <button className="profile-btn" onClick={updateProfilePicture}>Update avatar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
const ProfileBlocked = ()=>{
    return(
        <p>Log in first to view your profile</p>
    )
}

export default Profile

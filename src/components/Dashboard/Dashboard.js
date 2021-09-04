import React,{useState, useEffect} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router';
import DashBlocked from './DashBlocked/DashBlocked'
import './Dashboard.css';
import ProfileColumn from './ProfileColumn/ProfileColumn';
import Chats from './Chats/Chats';
import ChatContent from './ChatContent/ChatContent';
import store from '../../Redux/store';

const Dashboard = () => {

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
            haveAcces == true ? <DashContent logOut={logOut}/> : <DashBlocked />
        }
        </>
    )
}


const DashContent = ({logOut})=>{
    return(
        <div className="dashcontent-container">
            {/* <p>Allowed</p>
            <button onClick={()=>{
                logOut();
            }}>Log out </button> */}

            <ProfileColumn logOut={logOut}/>
            <Chats />
            <ChatContent />
        </div>
    )



       

}
export default Dashboard

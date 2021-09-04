import React,{useState, useEffect,useRef} from 'react'
import './ChatContent.css';
//current friend ID
import store_friends from '../../../ReduxFriends/store';
//get the user ID from here
import store from '../../../Redux/store';
import DefaultUserIcon from '../../../images/default_user.png';
import axios from 'axios';

const ChatContent = () => {
    const [currentFriend, setCurrentFriend] = useState(null);

    const [messagesArr, setMessagesArr] = useState(null);

    const [newMessContent, setNewMessContet] = useState('');

    const myRef = useRef(null);
    useEffect(()=>{
        store_friends.subscribe(()=>{
            console.log("FRIEND STATE:", store_friends.getState())
            setCurrentFriend(store_friends.getState())
        })
    },[])
    useEffect(async ()=>{
        if(currentFriend != null)
        {
            //fetch la API pentru a lua mesajele cu noul prieten (custom request);
            const config = {
                body:{
                    iWant: 'get-messages',
                    user_1: store.getState().userID,
                    user_2: currentFriend.selectedFriend
                }
            }
            axios.post('/api/custom-request',config)
            .then(res=>{
                console.log("RESP la mesaje:", res.data.arr)
                setMessagesArr(res.data.arr);
            })
            .catch((err)=>{
                console.log("eroare la fetch mesaje!")
            })
        }
    },[currentFriend])

    useEffect(()=>{
        if(messagesArr != null)
        {
            if(messagesArr.length > 15)
            {
               executeScroll();

            }
        }
    },[messagesArr])

    const handleNewMessChange = (e)=>{
        console.log(e.target.value);
        setNewMessContet(e.target.value);
    }

   
    const handleSendNewMess = ()=>{
        if(newMessContent != '')
        {
            const config = {
                body:{
                    user_1_id: store.getState().userID,
                    user_2_id: currentFriend.selectedFriend,
                    sender: store.getState().userID,
                    content: newMessContent
                }
            }
            axios.post('/api/push-mess', config)
                .then(res=>{
                    console.log(res);
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
        else
        {
            console.log("cannot set empty mess!")
        }
    }

    const renderMessage = (data)=>{
        if(data.sender == currentFriend.selectedFriend)
        {
            if(data['ref_scroll'] == undefined)
            {
                return (
                    <div className="from-other">
                        <span>{data.content} </span>
                    </div>
                )
            }
            else
            {
                if(data['ref_scroll'] == false)
                {
                    return (
                        <div className="from-other">
                            <span>{data.content} </span>
                        </div>
                    ) 
                }
                else
                {
                    return (
                        <div ref={myRef} className="from-other">
                            <span>{data.content}</span>
                        </div>
                    )
                }
                
            }
        }
        else
        {
            if(data['ref_scroll'] == undefined )
            {
                return (
                    <div className="from-me">
                        <span>{data.content} </span>
                    </div>
                )

            }
            else
            {
                if(data['ref_scroll'] == false)
                {
                    return (
                        <div className="from-me">
                            <span>{data.content} </span>
                        </div>
                    )
                }
                else
                {
                    return(
                        <div ref={myRef} className="from-me">
                            <span>{data.content}</span>
                        </div>
                    )
                }
            }
        }
    }
    
    const testFct = ()=>{
        setMessagesArr((prev)=>{
            return [
                ...prev,
                {
                    sender: '613337caf135e0b986c8a45d',
                    content: 'TEST SCROLL'

                }
            ]
        })
    }
    const testShowMore = ()=>{
        console.log('testShowMore');
        setMessagesArr((prev)=>{
            let temp_data = [...prev]
            //remove prev ref scroll
            temp_data.forEach((el, index)=>{
                if(el['ref_scroll']!= undefined)
                {
                    console.log("am gasit ref_scroll veche!")
                    temp_data[index]['ref_scroll'] = false;
                }
            })
            temp_data[0]['ref_scroll'] = true;
            console.log('temp_data', temp_data);
            for(let i=0;i<=10;i++)
            {
                temp_data.unshift({
                    sender: '613337caf135e0b986c8a45d',
                    content: 'TEST SCROLL'
                })
            }
           

            return [...temp_data];
        })
    }

    const executeScroll = () => myRef.current.scrollIntoView()
   
    return (
        <>
        {
            currentFriend == null ? <p>  No friend selected</p> :
            <div className="chatcontent-container">
            <div className="chatcontent-upper">
                <div className="chatcontent-upper-left">    
                    <img src={currentFriend.friendAvatar == null ? DefaultUserIcon : currentFriend.friendAvatar} alt="selected user"/>
                    <div className="upper-left-name">
                        <span>   
                            {currentFriend.friendName}
                        </span>
                    </div>
                </div>
                
                <div className="chatcontent-upper-right">
                </div>
            </div>

            <div className="chatcontent-main">
                <button onClick={testShowMore}>Show more</button>
                {
                    messagesArr == null ? <p>No messages yet</p>:
                    messagesArr.map((el)=>{
                        return renderMessage(el)
                    })
                }
            </div>

            <div className="chatcontent-input">
                <div className="input-container">   
                    <input type="text" placeholder="Type something..." value={newMessContent} onChange={handleNewMessChange}>
                    
                    </input >
                    <button onClick={handleSendNewMess}>
                        Send
                    </button>
                    <button onClick={testFct}>TEST</button>
                    <button onClick={executeScroll}>executeScroll</button>
                </div>
            </div>
        </div>
        }
       </>
    )
}

export default ChatContent

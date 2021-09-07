
import React,{useState, useEffect,useRef} from 'react'
import './ChatContent.css';
//current friend ID
import store_friends from '../../../ReduxFriends/store';
//get the user ID from here
import store from '../../../Redux/store';
import DefaultUserIcon from '../../../images/default_user.png';
import axios from 'axios';
import MsgReceivedAudio from '../../../audio/msg_received.mp3';
import Pusher from "pusher-js";


const ChatContent = () => {
    const [currentFriend, setCurrentFriend] = useState(null);

    const [messagesArr, setMessagesArr] = useState(null);
    const [shortMessagesArr, setShortMessagesArr] = useState(null);

    const [newMessContent, setNewMessContet] = useState('');

    const [booleanScrollBottom, setBooleanScrollBottom] = useState(false);

    const [msgAudio, setMsgAudio] = useState(new Audio(MsgReceivedAudio))


    const myRef = useRef(null); //top ref (show more);
    const myBotomRef = useRef(null); //scroll bottom when receiving a new message

    useEffect(()=>{

        let pusher = new Pusher('aa8949b8b54f419e28a5', {
            cluster: 'eu'
          });
      
          let channel = pusher.subscribe('messages');
          channel.bind('inserted', (data)=>{

            //veridica daca user_1 si user_2 sunt aceeasi din Pusher update;
            
            let friend_id = store_friends.getState().selectedFriend;
            let my_id = store.getState().userID;
            if((data.user_1 == friend_id && data.user_2 == my_id)||(data.user_1 == my_id && data.user_2 == friend_id))
            {
                testFct(data.new_msg)
            }
            //
          });    
        
    },[])



    useEffect(()=>{
        store_friends.subscribe(()=>{
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
                setMessagesArr(res.data.arr.reverse());
            })
            .catch((err)=>{
            })
        }
    },[currentFriend])

    useEffect(()=>{
        if(messagesArr != null)
        {
            let temp_new_arr = [];
            for(let i=0;i<7;i++)
            {
                temp_new_arr.push(messagesArr[i]);
            }
            setShortMessagesArr([...temp_new_arr].reverse())
        }
    },[messagesArr])
    
    useEffect(()=>{
        if(shortMessagesArr != null)
        {
            //cazul in care s-a apasat macar odata pe show more
            //initial length = 7 (cat se ia la primul cut din vectorul mare in vectorul nul)
            if(shortMessagesArr.length >7 )
            {
                if(booleanScrollBottom == true)
                {
                    //scroll bottom ref
                    console.log("SCROLL BOTTOM")
                    setBooleanScrollBottom(false);
                    executeScroll('bottom');
                    console.log("after")
                }
                else
                {
                    //scroll top
                    executeScroll('top');
                }
            }

        }
    },[shortMessagesArr])

    const handleNewMessChange = (e)=>{
        setNewMessContet(e.target.value);
    }

   
    const handleSendNewMess = (e)=>{
        e.preventDefault();
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
                    setNewMessContet('')
                })
                .catch((err)=>{
                    setNewMessContet('')  
                })
        }
        else
        {
            console.log("cannot set empty mess!")
        }
    }

    const renderMessage = (data)=>{
        //1. top-undefined, bottom-undefined
        //ref_scroll
        //bottom-ref

        let class_text = ''
        if(data == undefined)
            return

        if( data.sender == currentFriend.selectedFriend)
        {
            class_text = 'from-other'
        }
        else
        {
            class_text='from-me'
        }

        if(data['ref_scroll'] == true )
        {
            return (
                <div ref={myRef} className={`${class_text}`}>
                    <div>{data.content}</div>

                </div>
            )
        }
        else if(data['bottom-ref'] == true )
        {
            return (
                <div ref={myBotomRef} className={`${class_text}`}>
                    <div>{data.content}</div>
                </div>
            )
        }
        else
        {
            return (
                <div className={`${class_text}`}>
                    <div>{data.content}</div>
                </div>
            )
        }

                    
    }
    
    //push at end of arr (equivalent - update in db )
    const testFct = (msg_to_insert)=>{
        setBooleanScrollBottom(true);

        setShortMessagesArr((prev)=>{
            //insert the new message
            let temp_obj_short = [ ...prev,
                {
                    ...msg_to_insert

                }]

                //remove old bottom ref
                temp_obj_short.forEach((el,index)=>{
                    if(el != undefined  && el['bottom-ref'] != undefined)
                    {
                        temp_obj_short[index]['bottom-ref'] = false;
                    }
                })
                //insert new bottom ref
                temp_obj_short[temp_obj_short.length-1]['bottom-ref'] = true;
                
                msgAudio.play();
            //console.log("IN TEST:", temp_obj_short)

            return [...temp_obj_short]
        })
    }
    const testShowMore = ()=>{

        let length_short_arr = shortMessagesArr.length;
        let length_big_arr = messagesArr.length;

        if(length_big_arr - length_short_arr > 5)
        {
            console.log("caz dinamic")
            //caz dinamic
            let temp_short_data = [...shortMessagesArr];
            temp_short_data.forEach((el, index)=>{
                //anuleaza referintele vechi
                if(el['ref_scroll']!= undefined)
                {
                    temp_short_data[index]['ref_scroll'] = false;
                }
            })
            console.log("temp short data[0]",temp_short_data[0] )
            temp_short_data[0]['ref_scroll'] = true;
            for(let i=length_short_arr;i<length_short_arr+5;i++)
            {
                temp_short_data.unshift({
                    ...messagesArr[i]
                })
            }

            setShortMessagesArr([...temp_short_data])
        }
        else
        {
            console.log("caz static")
            //pune in short arr restul de elemente (big arr nu are ramas in el mai mult de 15 elemente)
            //+cazul in care length_short_arr == length_long_arr
            let temp_short_data = [...shortMessagesArr];
            temp_short_data.forEach((el, index)=>{
                //anuleaza referintele vechi
                if(el['ref_scroll']!= undefined)
                {
                    temp_short_data[index]['ref_scroll'] = false;
                }
            })
            temp_short_data[0]['ref_scroll'] = true;
            for(let i=length_short_arr;i<length_big_arr;i++)
            {
                temp_short_data.unshift({
                    ...messagesArr[i]
                })
            }
            setShortMessagesArr([...temp_short_data])

        }

    }

    const executeScroll = (where) => {
        if(myRef.current != null)
        {
            if(where == 'top')
            {
                console.log("execute scroll top")
                myRef.current.scrollIntoView()
                return;
            }
        }
        if(myBotomRef != null)
        {
            if(where == 'bottom')
            {
                console.log("execute scroll bottom")
                myBotomRef.current.scrollIntoView();
                return;
            }
        }

    }
   
    return (
        <>
        {
            currentFriend == null ? <NoFriendSelected /> :
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

            <div className="chatcontent-main" id="style-4">
                <div className="btn-show-more-container">
                    <button className="btn-chat-content" onClick={testShowMore}>Show more</button>
                </div>
                {
                    shortMessagesArr == null ? <p>No messages yet</p>:
                    shortMessagesArr.map((el)=>{
                        return renderMessage(el)
                    })
                }
            </div>

            <div className="chatcontent-input">
                <div className="input-container">   
                <form onSubmit={handleSendNewMess}>
                    <input type="text" placeholder="Type something..." value={newMessContent} onChange={handleNewMessChange}>
                    </input >
                </form>                    
                    <button className="btn-chat-content" onClick={handleSendNewMess}>
                        Send
                    </button>
                    {/* <button onClick={testFct}>TEST</button>
                    <button onClick={executeScroll}>executeScroll</button> */}
                </div>
            </div>
        </div>
        }
       </>
    )
}


const NoFriendSelected = ()=>{
    return(
        <div className="noFriendSelected-container">
            <span>Please select a chat</span>
        </div>
    )
}
export default ChatContent

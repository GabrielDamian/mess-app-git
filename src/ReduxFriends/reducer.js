
let intial_state ={
    selectedFriend: null,
    friendName: null,
    friendAvatar: null
}
function reducer_friends(state={...intial_state}, action)
{
    switch(action.type)
    {
        case 'update_selectedFriend':
            return{
                ...state,
                selectedFriend: action.payload.newFriendID,
                friendName: action.payload.newFriend_name,
                friendAvatar: action.payload.newFriend_avatar
            }
        default:{
            return state
        }
    }
}

export default reducer_friends;
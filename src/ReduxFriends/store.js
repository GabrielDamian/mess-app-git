import {createStore}  from 'redux';
import reducer from './reducer';


let store_friends =createStore(reducer);
export default store_friends;
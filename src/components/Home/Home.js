import React from 'react'
import './Home.css';
import HomeSVG from '../../images/home.svg'
import { useHistory } from 'react-router';
const Home = () => {
    const history = useHistory();

    return (
        <div className="home-container">
            <div className="home-container-left">
                <div className="home-left-title">
                   Apollo Chat App
                </div>
                <div className="home-left-description">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type 
                </div>
                <button onClick={()=>{history.push('/signup')}}>Sign up</button>
            </div>
            <div className="home-container-right">
                <img src={HomeSVG}></img>
            </div>
        </div>
    )
}

export default Home

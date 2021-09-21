import React from 'react'
import './DashBlocked.css';
import NotAllowedSVG  from '../../../images/notAllowed.svg';
import { useHistory } from 'react-router';
const DashBlocked = () => {
    const history = useHistory();

    return (
        <div className="dash-blocked-container">
            <div className="dash-blocked-content">
                <span>You are not allowed to view this page, please log in first</span>
                <div className="submit-btn-signup">
                    <button onClick={()=>history.push('/login')}>
                        Login
                    </button>
                </div>
                <img src={NotAllowedSVG} alt="not allowed svg"/>
            </div>
            
        </div>
    )
}

export default DashBlocked

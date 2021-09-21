import React from 'react'
import './NotFound404.css';
import SvgNotFound from '../../images/404.svg';
const NotFound404 = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-container-content">
                <span>Sorry, this page was not found...</span>
                <img src={SvgNotFound} alt="svg not found"/>
            </div>
        </div>
    )
}

export default NotFound404

import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router';
import LoginSVG from '../../images/login.svg'


const Login  = ()=>{
    
    let history = useHistory();
    const [formData, setFormData] = useState({
        email: '',
        password: ''

    });
    const [errText, setErrText] = useState('');

    const handleInputChange= (e)=>{
        setFormData((prev)=>{
            let obj = {...prev};
            obj[e.target.name] = e.target.value;
            return obj
        })
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(formData.email.length == 0 || formData.password.length == 0)
        {
            console.log("Empty email or password!")
        }
        else
        {
            axios.post('api/user/login',formData)
            .then((res)=>{
                console.log(res)
                localStorage.setItem('token',res.data)
                history.push('/dashboard')
                
            })
            .catch(error => {
                console.log(error.response.data);
            });
            
        }
    }
    return(
        <div className="signup-container">
            <div className="signup-container-left">
                <span>Apollo Chat</span>
                <img src={LoginSVG}></img>
            </div>
            <div className="signup-contaier-right">
                <form>
                    <div className="title-label">
                        Login
                    </div>
                    <label>
                        <p>Email</p>
                        <input type="text" name="email" onChange={handleInputChange}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" name="password" onChange={handleInputChange}/>
                    </label>

                    <div className="submit-btn-signup">
                        <button class="rainbow-button" onClick={handleSubmit}>Login</button>
                    </div>
                    <div className="err-div">
                        {errText}
                    </div>
                    <div className="switch-login-signup" onClick={()=>{history.push('/signup')}}>
                        Don't have an account? Sign up here.
                    </div>
            </form> 
            </div>
            
        </div>
    )
}

export default Login

{/* <div className="sign-up-container-under-menu">
                <div className="sign-up-container-center-form">
                    <div className="sign-up-container-title">
                        <div className="sign-up-title-padding">
                            <span>Login</span>
                        </div>
                    </div>
                    <div className="sign-up-container-form-container">
                        <div className="sign-up-form-container-padding">
                            <form className="sign-up-form">
                                <label>
                                    <span>Email</span>
                                    <input type="text" name="email" onChange={handleInputChange}/>
                                </label>
                                <label>
                                    <span>Password</span>
                                    <input type="text" name="password" onChange={handleInputChange}/>
                                </label>

                                <label className="submit-btn-label">
                                    <button onClick={handleSubmit}>Log in</button>
                                </label>
                                <label className="change-state-signin-signup">
                                    <p onClick={()=>{history.push('/signup')}}>Don't have an account? Sign up.</p>
                                </label>
                        </form>
                        </div>
                    </div>
                </div>
            </div> */}
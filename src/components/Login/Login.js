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
        setErrText('');
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
            axios.post('/api/user/login',formData)
            .then((res)=>{
                console.log(res)
                localStorage.setItem('token',res.data)
                history.push('/dashboard')
                
            })
            .catch(error => {
                console.log(error);
                setErrText('There was a problem logging you in.')
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

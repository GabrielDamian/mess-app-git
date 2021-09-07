import React,{useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import SignupSVG from '../../images/signup.svg'
import './Signup.css';

const Signup = () => {
    let history = useHistory();
    
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: '',
        doublePassword: '',
    })
    const [errText, setErrText] = useState('');

    useEffect(()=>{
        setErrText('');
    },[inputData])

    const handleInputChange = (e)=>{

        setInputData((prev)=>{
            let newInput = {...prev};
            newInput[e.target.name] = e.target.value;
            return newInput;
        })
    }
    useEffect(()=>{
        console.log(inputData)
    },[inputData])

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(inputData.name.length == 0 || inputData.email.length == 0 || inputData.password.length == 0)
        {
            console.log("Empty input data!")
        }
        else
        {
            if(inputData.password != inputData.doublePassword)
            {
                console.log("passwords don't match!")
                setErrText("Passwords don't match.")
            }
            else
            {
                //vr sa trimitem la axios, fara double passwor
                let copyObj = inputData;
                delete copyObj.doublePassword

                axios.post('/api/user/register',copyObj)
                .then(res=>{
                    console.log(res)
                    console.log("token signup:", res.data);
                    localStorage.setItem('token',res.data)
                    history.push('/dashboard');
                    
                })
                .catch(error => {
                    console.log(error)
                    //setErrText(error.response.data.message);
                });
            }

        }
    }


    return (
        <div className="signup-container">
            <div className="signup-container-left">
                <span>Apollo Chat</span>
                <img src={SignupSVG}></img>
            </div>
            <div className="signup-contaier-right">
                <form>
                    <div className="title-label">
                        Signup
                    </div>
                    <label>
                        <p>Name</p>
                        <input type="text" name="name" onChange={handleInputChange}/>
                    </label>
                    <label>
                        <p>Email</p>
                        <input type="text" name="email" onChange={handleInputChange}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" name="password" onChange={handleInputChange}/>
                    </label>
                    <label>
                        <p>Repeat password</p>
                        <input type="password" name="doublePassword" onChange={handleInputChange}/>
                    </label>
                    <div className="submit-btn-signup">
                        <button class="rainbow-button" onClick={handleSubmit}>Signup</button>
                    </div>
                    <div className="err-div">
                        {errText}
                    </div>
                    <div className="switch-login-signup" onClick={()=>{history.push('/login')}}>
                        Already have an account ?Log in here
                    </div>
            </form> 
            </div>
            
        </div>
    )
}

export default Signup

{/* <form>
                <label>
                    <p>Name</p>
                    <input type="text" name="name" onChange={handleInputChange}/>
                </label>
                <label>
                    <p>Email</p>
                    <input type="text" name="email" onChange={handleInputChange}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" name="password" onChange={handleInputChange}/>
                </label>
                <label>
                    <p>Repeat password</p>
                    <input type="password" name="doublePassword" onChange={handleInputChange}/>
                </label>
                <label>
                    <button onClick={handleSubmit}>Submit</button>
                </label>
            </form> */}
import {BarLoader} from 'react-spinners';
import { useState,useRef } from 'react';
import axios from "axios";
import "../stylesheets/signinCard.css"
function SignInCard(props){
    const [spin, setSpin] = useState(false);
    const [msg, setMsg] = useState("");
    const refs = useRef(new Array(6));
    console.log(process.env.REACT_APP_BURL);
    const HandleSignin=async()=>{ 
          for(let i=0;i<6;i++){
            if(refs.current[i].value === ""){
                refs.current[i].className = 'empty';
                refs.current[i].focus();
                setSpin(false);
                return;
                }
            }
            if(refs.current[4].value !== refs.current[5].value){
                setMsg("Both passwords do not match!");
                refs.current[5].className = 'empty';
                refs.current[5].focus();
            }
            setSpin(true);
            localStorage.setItem("user-data",JSON.stringify({
                "firstName":refs.current[0].value,
                "lastName":refs.current[1].value,
                "email":refs.current[2].value,
                "contactNumber":refs.current[3].value,
                "password":refs.current[4].value,
                "accountType":props.role,
                "confirmPassword":refs.current[5].value
            }));
            console.log(refs.current[2].value);
            await axios.post(`${process.env.REACT_APP_BURL}/api/v1/auth/sendotp`,
            {
                email:refs.current[2].value
            }).then(()=>{window.location.href = `/verify`}).catch((err)=>{
                console.log(err);
            });
            setSpin(false);
    }
    const checkCpass=()=>{
        if(refs.current[4].value !== refs.current[5].value){
            setMsg("Both passwords do not match!");
        }
        else{
            setMsg("");
        }
    }
    return (
        <>
        <div className="SigninMain">
        {spin &&<BarLoader color="#36d7b7" width={"100%"} className='loader'/>}
            <div className="SigninPanel">
                <div className="nameInput">
                    <div className='fname'>
                    <p>First Name: </p>
                    <input type="text"  required placeholder='Enter first name' ref={(element)=>refs.current[0]=(element)} ></input>
                    </div>
                    <div className='lname'>
                    <p>Last Name: </p>
                    <input type="text" required placeholder='Enter last name' ref={(element)=>refs.current[1]=(element)}></input>
                    </div>
                </div>
                <p>Email Address *</p>
                <input id="test" type="text" placeholder="Enter Email Address" ref={(element)=>refs.current[2]=(element)}></input>
                <p>Phone number *</p>
                <div className='phoneInput'>
                    <select className='phoneInput-select' value={"+91"}>
                        <option value="+91">+91</option>
                        <option value="+44">+44</option>
                    </select>
                    <input type='number' required placeholder='12345 67890' ref={(element)=>refs.current[3]=(element)}></input>
                </div>
                <div className='passwordInput'>
                <div className='epassword'>
                <p>Create Password *</p> 
                <input type="password" placeholder="Enter Password" ref={(element)=>refs.current[4]=(element)}></input>
                </div>
                <div className='cpassword'>
                <p>Confirm Password *</p>
                <input type="password" onChange={checkCpass} placeholder="Enter Password" ref={(element)=>refs.current[5]=(element)}></input>
                </div>
                <p className='message'>{msg}</p>
                </div>
                <button type="button" onClick={HandleSignin}>Create Account</button>
            </div>
        </div>
        </>
    )
}
export default SignInCard;
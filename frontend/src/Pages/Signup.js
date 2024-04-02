import SignInCard from "./SigninCard";
import "../stylesheets/HomePage.css"
import img from "../study-photo.jpg"
import { useState } from "react";
const SignupPage = (props)=>{
    const [role, setRole] = useState("");
    return (
        <div className="home-container">
            <div className="SignIn">
                <h2>Join the millions learning to<br/> code with StudyNotion for <br/>free</h2>
                <p>Build Skills for today, tomorrow, and beyond. Education to future-proof your career.</p>
                <div className="role-selector">
                    <div className="role-container">
                        <label htmlFor="student"><input type="radio" id="student" value="student" name="role" onChange={()=> setRole("Student")} defaultChecked></input><p>Student</p></label>
                        <label htmlFor="instructor"><input type="radio" id="instructor" value="instructor" name="role" onChange={()=> setRole("Instructor")}></input><p>Instructor</p></label>
                    </div>
                </div>
                <SignInCard role={role}/>
            </div>
            <img src={img} alt="" className="img-sign"></img>
        </div>
    )
}
export default SignupPage;
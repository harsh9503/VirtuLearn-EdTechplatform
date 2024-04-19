import { useEffect, useState,useRef } from "react";
import { FaStar, FaRegStar} from "react-icons/fa";
import axios from "axios";
import { IoMdCheckmarkCircleOutline,IoIosRemoveCircleOutline } from "react-icons/io";
import "../stylesheets/Wishlist.css";
import { IconContext } from "react-icons/lib";
const CourseDialog = (props)=>{
    const thisEle = useRef("");
    window.onclick= (event)=>{
        if(!event.target.className.includes("course-menu")){
            const arr = document.querySelectorAll(".course-menu");
            arr?.forEach((ele)=>ele.classList.remove("active"));
        }
    };
    const stars = [];
    for(let x = 1;x<=5;x++){
        if(x <= props.avgRating) stars.push(<FaStar/>);
        else stars.push(<FaRegStar/>)
    }
    useEffect(()=>{
        thisEle.current?.addEventListener("click",(event)=>{
            console.log(event.target);
            if(event.target.className.includes("course-menu")) return;
            window.location.href = "/course/"+props.id;
        })
    },[]);
    return (
        <div className="course-dialog" ref={thisEle}>
            <div className="course-info-enrolled" style={{width:"30%"}}>
                <img className="course-icon" src={props.image}></img>
                <div className="course-data-enrolled">
                    <p className="no-margin">{props.coursename}</p>
                </div>
            </div>
            <div className="course-instructor" style={{width:"20%"}}>{props.instructor}</div>
            <div className="course-price" style={{width:"10%"}}>{props.price}</div>
            <div className="course-rating" style={{width:"auto"}}>{props.avgRating}&nbsp;&nbsp;
                <div className="course-stars">
                <IconContext.Provider value={{size:"20px"}}>{stars}
            </IconContext.Provider>
                </div>
            </div>
            <div className="course-menu" onClick={(event)=>{event.target?.classList?.toggle("active")}}>&#8942;
                <div className="menu">
                    <div className="no-margin"><IoMdCheckmarkCircleOutline display={"inline-block"} size={"20px"}/>&nbsp;&nbsp;Mark as Completed</div>
                    <div className="no-margin"><IoIosRemoveCircleOutline display={"inline-block"} size={"20px"}/>&nbsp;&nbsp;Remove</div>
                </div>
            </div>
        </div>
    )
}
const Wishlist = () =>{
    const [wishlist, setWishlist] = useState([]);
    useEffect(()=>{
        axios.post(`${process.env.REACT_APP_BURL}/api/v1/profile/getwishlist`,{},{withCredentials:true}).then((res)=>{
            setWishlist(res.data.wishlist);
        }).catch((err)=>{
            console.log(err);
        })
    },[]);
    return (
        <div className="wishlist-main">
            <div className="path white">
                    Home / Dashboard / <span className="text-yellow">Wishlist</span>
            </div>
            <h2 className="white">Wishlist</h2>
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div className="wishlist-title" style={{width:"30%"}}>Title</div>
                    <div className="wishlist-title" style={{width:"20%"}}>Instructor</div>
                    <div className="wishlist-title" style={{width:"10%"}}>Price</div>
                    <div className="wishlist-title" style={{width:"10%"}}>Rating</div>
                </div>
                {wishlist.map((ele)=>{
                    return <CourseDialog instructor={ele.instructor} id={ele._id} coursename={ele.courseName} image={ele.thumbnail} price={ele.price} avgRating={ele.avgRating}/>
                })}
            </div>
        </div>
    )
}
export default Wishlist;
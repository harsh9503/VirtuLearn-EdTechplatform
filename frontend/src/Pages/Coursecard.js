import { FaStar, FaRegStar } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../stylesheets/Coursecard.css";
import { useEffect} from "react";
const CourseCard = (props)=>{
    const stars = [];
     for(let i=1;i<=5;i++){
        if(i <= props.stars) stars.push(<FaStar/>);
        else stars.push(<FaRegStar/>)
    }
    useEffect(()=>{
        document.getElementsByClassName("course-main")[props.index].addEventListener("click",()=>{
            window.location.href = "/course/"+props._id;
        });
    },[]);
    return(
        <div className="course-main">
            <div className="div-thumbnail">
                <img className="thumbnail" src={props.thumbnail}></img>
            </div>
            <div className="course-info">
                <p className="course-name">{props.coursename}</p>
                <p className="instructor-name">{props.instructor}</p>
                <div className="review-stars">
                <p>{props.stars||"No reviews"}</p>
                <IconContext.Provider value={{size:"20px",style:{"display":"inline-block",marginRight:"5px"}}}>
                    {props.stars?stars:""}
                </IconContext.Provider>
                <p>{`(${props.rcount})`}</p>
                </div>
                <div className="course-price">{"Rs. "+props.price.toLocaleString('en-US')}</div>
            </div>
        </div>
    )
}
export default CourseCard;
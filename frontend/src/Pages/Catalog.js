import { useEffect, useState } from "react";
import "../stylesheets/Catalog.css";
import {useParams} from "react-router-dom";
import CourseCard from "./Coursecard";
import axios from "axios";
const CatalogMain=()=>{
        const {catalogId} = useParams();
        const [catalog,setCatalog] = useState("");
        const [desc,setDesc] = useState("");
        const [course,setCourse] = useState([]);
        const [ratings, setRatings] = useState([]);
        useEffect(()=>{
            axios.post(`${process.env.REACT_APP_BURL}/api/v1/course/getCategoryInfo`,{
                catalogId:catalogId
            }).then((res)=>{
                setCatalog(res.data.data.name);
                setDesc(res.data.data.description);
                setCourse(res.data.data.courses.map((c,idx)=>{
                    return <CourseCard stars={idx<ratings.length?ratings[idx]:0} index={idx} onclick={()=>{window.location.href = "/course/"+c._id}} thumbnail={c.thumbnail} coursename={c.courseName} instructor={c.instructor.firstName+" "+c.instructor.lastName} price={c.price} />
                }))
            }).catch((err)=>{
                console.log(err);
            })
            const requests = new Array(course.length);
            for(let i=0;i<course.length;i++){
                requests[i] = axios.get(`${process.env.REACT_APP_BURL}/api/v1/course/getAverageRating`,{
                    courseId : course[i]._id
                }).then((res)=>{
                    const fetched = ratings.length?ratings:new Array(course.length);
                    fetched[i] = res.data.averageRating;
                    console.log(fetched);
                    setRatings(fetched);
                })
            }
            Promise.all(requests);
        },[]);
    return (
        <>
        <div className="catalog-head">
            <div className="catalog-head-desc">
                <div className="div-path white">
                    {`Home / Catalog / `}<span className="text-yellow">{catalog?catalog[0].toUpperCase() +catalog.slice(1):""}</span>
                </div>
                <h2 className="white">{catalog}</h2>
                <p className="catalog-description">{desc}</p>
            </div>
            <div className="catalog-head-related">
            </div>
        </div>
        <div className="catalog-main">
            <h2>Courses to get you started</h2>
            <div className="course-category">
                <input type="radio" id="Most-popular" name="course-category" value="Most-popular" defaultChecked></input><label htmlFor="Most-popular"><p>Most Popular</p></label>
                <input type="radio" id="New" name="course-category" value="New"></input><label htmlFor="New"><p>New</p></label>
                <input type="radio" id="Trending" name="course-category" value="Trending"></input><label htmlFor="Trending"><p>Trending</p></label>
                <hr></hr>
            </div>
            <div className="courses">
            {course}
            </div>
        </div>
        </>
    )
}

export default CatalogMain;
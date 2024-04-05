const Course= require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const User = require("../models/User")

const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")

//--------------------------------------------------------------------------------------
exports.createCourse = async (req, res) => {
        try{
          const userId = req.user.id
            
          let {
            courseName,
            courseDescription,
            whatYouWillLearn:_whatYouWillLearn,
            price,
            tag:_tag,
            category,
            status,
            instructions: _instructions,
          } = req.body

          // Get thumbnail image from request files
          const thumbnail = req.files.thumbnailImage;
          const tag = JSON.parse(_tag)
         const instructions = JSON.parse(_instructions)
          const whatYouWillLearn =JSON.parse(_whatYouWillLearn)
            // Check if any of the required fields are missing
            if (
              !courseName ||
              !courseDescription ||
              !whatYouWillLearn ||
              !price ||
              !tag ||
              !thumbnail ||
              !category ||
              !instructions
            ) {
              console.log(req.body);
              return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
              })
            }

            //if (!status || status === undefined) {
              status = "Published"
            //}
            // Check if the user is an instructor
            const instructorDetails = await User.findById(userId, {
              accountType: "Instructor",
            })

            if(!instructorDetails){
                return res.status(404).json({
                    success: false,
                    message: "Instructor Details not found",
                   })
            }

            // Check if the Category given is valid
            const categoryDetails = await Category.findById(category)
            if (!categoryDetails) {
              return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
              })
            }
            
              // Upload the Thumbnail to Cloudinary
              const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
              )
              const newCourse = await Course.create({
                courseName,
                courseDescription,
                instructor: instructorDetails._id,
                whatYouWillLearn: whatYouWillLearn,
                price,
                tag,
                category: categoryDetails._id,
                thumbnail: thumbnailImage,
                status: status,
                instructions,
              })

              // Add the new course to the User Schema of the Instructor
              await User.findByIdAndUpdate(
                {
                  _id: instructorDetails._id,
                },
                {
                  $push: {
                    courses: newCourse._id,
                  },
                },
                { new: true }
              )

              // Add the new course to the Categories
              const categoryDetails2 = await Category.findByIdAndUpdate(
                { _id: category },
                {
                  $push: {
                    courses: newCourse._id,
                  },
                },
                { new: true }
              )

              console.log("Category details:", categoryDetails2)

            // Return the new course and a success message
            res.status(200).json({
                success: true,
                data: newCourse,
                message: "Course Created Successfully",
            })

        }
        catch(error){
            console.error(error)
            res.status(500).json({
              success: false,
              message: "Failed to create course",
              error: error.message,
            })        

        }
}

//-------------------------------------------------------------------------------
// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Course details not found`,
      error: error.message,
    })
  }
}

//---------------------------------------------------------------------------
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
//-----------------------------------------------------------------------------------

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    console.log(courseDetails);
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos?courseProgressCount?.completedVideos: [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//-----------------------------------------------------------------------------------------
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

//-------------------------------------------------------------------------------------

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ 
        message: "Course not found" 
      })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

//---------------------------------------------------------------------------------------------
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ 
        error: "Course not found" 
      })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

//-------------------------------------------------------------------------------------

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ 
        error: "Invalid subsection" 
      })
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ 
          error: "Subsection already completed" 
        })
      }

      courseProgress.completedVideos.push(subsectionId)
    }

    await courseProgress.save()

    return res.status(200).json({ 
      message: "Course progress updated" 
    })

  } catch (error) { 
    console.error(error)
    return res.status(500).json({ 
      error: "Internal server error" 
    })
  }
}
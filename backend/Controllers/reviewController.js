import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

// get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res
      .status(200)
      .json({ success: true, message: "succesful", data: reviews });
  } catch (error) {
    res.status(404).json({ success: false, message: "not found" });
  }
};

export const createReview = async (req,res)=>{

    if(!req.body.doctor) req.body.doctor = req.params.doctorID
    if(!req.body.user) req.body.user = req.userID

    const newReview = new Review(req.body)

    try {
        const savedReview = await newReview.save()

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            // push id of saved review to reviews array of doctor document
            $push:{reviews:savedReview._id}
        })

        res.status(200).json({success:true, message:"review submitted", data:savedReview})
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }



}

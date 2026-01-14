const UserModel = require("../Models/User")

const addExpences = async(req,res)=>{
    const body = req.body;
    const {_id} = req.user;
   try {
       const userData = await UserModel.findByIdAndUpdate(
        _id,
        {
            $push:{ expences: body}
        },
        {new: true}
       );
       return res.status(200).json({
        message:"Expense Added successfully",
        success:true,
        data: userData?.expences
       });
   } catch (err) {
    return res.status(500).json({
        message: "Something went wrong",
        error: err,
        success: false
    })
    
   }
}

const fetchExpences = async(req,res)=>{
    const body = req.body;
    const {_id} = req.user;
   try {
       const userData = await UserModel.findById(_id).select('expences');
       return res.status(200).json({
        message:"Fetched Expenses successfully",
        success:true,
        data: userData?.expences
       });
   } catch (err) {
    return res.status(500).json({
        message: "Something went wrong",
        error: err,
        success: false
    })
    
   }
}

const deleteExpences = async(req,res)=>{
    const {_id} = req.user;
    const {expenceId} = req.params;
   try {
       const userData = await UserModel.findByIdAndUpdate(
        _id,
        {
            $pull:{ expences: {_id: expenceId}}
        },
        {new: true}
       );
       return res.status(200).json({
        message:"Expenses deleted successfully",
        success:true,
        data: userData?.expences
       });
   } catch (err) {
    return res.status(500).json({
        message: "Something went wrong",
        error: err,
        success: false
    })
    
   }
}

module.exports={
    addExpences,
    fetchExpences,
    deleteExpences
}
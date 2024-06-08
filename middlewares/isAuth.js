
const admin=require("../config/firebaseadmin.js");
const User =require('../models/user');
const isLoggedIn=async(req,res,next)=>{
        try{
            const token=req.headers.authorization.split(' ')[1];
            const decodeValue=await admin.auth().verifyIdToken(token);
            if(decodeValue){
                    return res.json({msg:"normaluser"});
                next();
            }
            return res.status(402).json({mess:"unauthorized acces"});
        }catch(err){
            return res.json({mess:"internal error"});
        } 

}

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Authorization token is missing" });
        }

        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: "Internal server error ", error: err.message });
    }
};


const isauthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Authorization token is missing" });
        }
        const decodeValue = await admin.auth().verifyIdToken(token);
        
        if (!decodeValue) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: "Internal server error ", error: err.message });
    }
};

module.exports={isLoggedIn,adminAuthMiddleware,isauthMiddleware};
const User = require('../models/User');
const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors');



const register = async(req,res)=>{
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user :{name:user.name},token});
}

const login = async(req,res)=>{
    const{email,password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please Provide Name and Password');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}

const deleteUser = async(req,res)=>{
    const {params:{email:email}} = req;
    const user = await User.findOneAndDelete({email:email});
    if(!user){
        throw new NotFoundError(`User does not exist with email ${email}`);
    }else{      
         const job = await Job.deleteMany({createdBy:user._id});
         if(!job){
            throw new NotFoundError(`No Jobs for the user exists ${email}`);
         }
    }
    res.status(StatusCodes.OK).json({name:user.name,email:user.email});
}
module.exports = {register,login,deleteUser}; 
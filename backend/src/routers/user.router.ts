import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Router } from "express";
import { UserModel } from "../models/user.model";
const router = Router();

router.get("/seed", asyncHandler(
  async (req, res) => {
     const foodsCount = await UserModel.countDocuments();
     if(foodsCount> 0){
       res.send("Seed is already done!");
       return;
     }
 
     await UserModel.create(sample_users);
     res.send("Seed Is Done!");
 }
 ))

router.post("/login", asyncHandler(
  async (req, res)=>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email,password})
  
    if(user){
      res.send(generateTokenReponse(user)); //successful response sending to the client
    }
    else
    {
      res.status(400).send("Username or password is not found")
    }
  
  }
))
  
  const generateTokenReponse = (user : any) => {
    const token = jwt.sign({ //precosee of generating token is called signing
      email:user.email, isAdmin: user.isAdmin
    },"SomeRandomText",{
      expiresIn:"30d"
    });
  
    user.token = token;
    return user;
  }
  
  export default router;
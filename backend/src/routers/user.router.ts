import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Router } from "express";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';
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
    const user = await UserModel.findOne({email})
  
    if(user && (await bcrypt.compare(password,user.password))){
      res.send(generateTokenReponse(user)); //successful response sending to the client
    }
    else
    {
      res.status(400).send("Username or password is not found")
    }
  
  }
))

router.post('/register', asyncHandler(
  async (req, res) => {
    const {name, email, password, address} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
      res.status(HTTP_BAD_REQUEST)
      .send('User is already exist, please login!');
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10); //10 is the salt of the hash

    const mongoose = require('mongoose');
    const validId = new mongoose.Types.ObjectId();
    const newUser:User = {
      id:validId,
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  }
))
  
  const generateTokenReponse = (user : any) => {
    const token = jwt.sign({ //precosee of generating token is called signing
      id: user.id, email:user.email, isAdmin: user.isAdmin
    },"SomeRandomText",{
      expiresIn:"30d"
    });
  
    user.token = token;
    return user;
  }
  
  export default router;
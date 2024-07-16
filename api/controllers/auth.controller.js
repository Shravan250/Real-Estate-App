import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import { Console } from "console";
import jwt from "jsonwebtoken";

export const register = async (req,res) =>{
    const { username , email , password } = req.body;

    try{
        //hash the password

        const hashedPassword = await bcrypt.hash(password , 10);

        //create new user and send to DB
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        })

        console.log(newUser);

        // Ensure only one response is sent
        if (!res.headersSent) {
          res.status(201).json({ message: "User Creates Succesfully"});
        }
      } catch (error) {
        console.error('Error during user registration:', error); // Log the error for debugging
        if (!res.headersSent) {
          res.status(500).json({ message: "Failed to create user!"});
        }
      } 
    
};

export const login = async (req,res) =>{
    const { username , password } = req.body;

    try{
      //check if user exist
      const user = await prisma.user.findUnique({
        where: { username }
      })

      if(!user) return res.status(401).json({ message: "Invalid Credentials!" });

      //check if password is correct
      const isPasswordValid = await bcrypt.compare(password , user.password);
  
      if(!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!" });

      //generate cookie token and send it to user

      // res.setHeader("Set-Cookie" ,"test=" + "myValue").json("success");
      const age = 1000 * 60 * 60 * 24 * 7;
      
      const token = jwt.sign({
          id: user.id,
          isAdmin: true,
        }, process.env.JWT_SECRET_KEY,
          { expiresIn: age }
      );

      const { password: userPassword , ...userInfo } = user;

      res.cookie("token" , token , {
        httpOnly: true,
        // secure: true,
        maxAge: age
      }).status(200).json(userInfo);

    } catch (error) {
      console.error('Error during user registration:', error); // Log the error for debugging
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to Create User"});
      }
    } 
}

export const logout = (req,res) =>{
    res.clearCookie("token").status(200).json({ message: "Logout Succesfully" });
}
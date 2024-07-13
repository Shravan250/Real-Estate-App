import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import { Console } from "console";

export const register = async (req,res) =>{
    //db operation
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
          res.status(500).json({ message: "Failed to Create User"});
        }
      } 
    
};

export const login = async (req,res) =>{
    //db operation
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
      res.setHeader("Set-Cookie" ,"test=" + "myValue").json("success");

    } catch (error) {
      console.error('Error during user registration:', error); // Log the error for debugging
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to Create User"});
      }
    } 
}

export const logout = (req,res) =>{
    //db operation
}
//************** Import libraries ************ *
const {User} = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs")
const userschema = require("../validations/userValidation.js") 
const Joi = require("joi")
const loginAuthourization = require("../middlewares/authMiddleware")
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

class UserObject {
  

  signup = async (req, res) => {
    const { userName, email, password } = req.body;
    const { error } = userschema.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }
    const userExist = await User.findOne({
      where: {
        [Op.or]: [{ userName: userName }, { email: email }],
      },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      if (userExist) {
        return res.status(404).json({ msg: "A User with these details already Exist" });
      }
    } catch (error) {
      throw error;
    }
    const createUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    try {
      if (createUser) {
        console.log(createUser);
        return res.status(201).json({ msg: "User created successfully" });
      }
    } catch (error) {
      throw error;
    }
  };


  


  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Email is not registered' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Password does not match" });
      const token = jwt.sign({ userId:user.userId,email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      res.cookie("token", token, {
        httpOnly: true,
        //secure: process.env.COOKIE_NODE_ENV === 'production', // Enable secure cookies in production
        //sameSite: 'strict', // Protect against CSRF
      });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


}

const userObject = new UserObject();

module.exports = userObject;
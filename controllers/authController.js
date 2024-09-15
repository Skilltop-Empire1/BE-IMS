//************** Import libraries ************ *
const userModel = require("../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const userschema = require("../validations/userValidation");
const Joi = require("joi");
const loginAuthourization = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const randompassword = require("../middlewares/passwordResetMiddleware");
const nodemailer = require("nodemailer");


//************* User Object ***************** */

class UserObject {
  //*********** reset passwords  ********/

  passwordReset = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.User.findOne({ 
      where: { email } 
    });

    try {
      if (!user) {
        return res.status(404).json({ msg: "User does not exist" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: {
          name: "IMS",
          address: process.env.EMAIL_USER,
        },
        to: "jakpan64@yahoo.com", //req.body.email,
        subject: "IMS Reset link",
        text: `Your new password is: ${newPassword}`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }

      // //***********generate random password */
      // const newPassword = await randompassword.generateRandomPassword();
      // const hashPassword = await bcrypt.hash(newPassword, 10);
      // const passwordToUpdate = toString(hashPassword);
      // const updatePassword = await userModel.User.update(
      //   { password: passwordToUpdate },
      //   { where: { email: email } }
      // );
      // if (!updatePassword) {
      //   return res.status(404).json({ msg: "Password updated failed" });
      // } else {
      //   console.log(updatePassword);
      //   res.status(201).json({ msg: "Password updated successfully" });
      // }

      // Send email with new password
      

      
  };






  //********* signup method ************** */

  signup = async (req, res) => {
    const { userName, email, password } = req.body;

    //********validation ***********/
    const { error } = userschema.userValidation.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }

    //*********check if user exist ********/
    const userExist = await userModel.User.findOne({
      where: {
        [Op.or]: [{ userName: userName }, { email: email }],
      },
    });

    /******hash password***** */
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      if (userExist) {
        return res
          .status(404)
          .json({ msg: "A User with these details already Exist" });
      }
    } catch (error) {
      throw error;
    }

    //*********create user if none exist ****** */
    const createUser = await userModel.User.create({
      userName,
      email,
      password: hashedPassword,
    });

    try {
      if (createUser) {
        console.log(createUser);
        res.status(201).json({ msg: "User created successfully" });
        return createUser;
      }
    } catch (error) {
      throw error;
    }
  };

  //************user signin  ***********/

  login = async (req, res) => {
    const { email, password } = req.body;

    //validate user login
    const { error } = userschema.validateLogin.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }

    //************check for user ************ */
    const user = await userModel.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send("Email is not registered");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    try {
      if (!isMatch) {
        return res.status(404).json({ msg: "Incorrect login details" });
      } else {
        return res.status(200).json({ msg: "Authentication success" });
      }
    } catch (error) {
      throw error;
    }
  };
}

//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;

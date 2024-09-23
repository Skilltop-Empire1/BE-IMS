//************** Import libraries ************ *
const userModel = require("../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const userschema = require("../validations/userValidation");
const Joi = require("joi");
const loginAuthourization = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const randompassword = require("../middlewares/passwordResetMiddleware");
const nodemailer = require("nodemailer");
const {loginJWTAthentication} = require("../middlewares/authMiddleware")

//************* User Object ***************** */

class UserObject {
//get all users
  getAllUsers = async (req, res)=>{
    const getUsers = await userModel.User.findAll();
    try {
      if(getUsers){
        return res.json(getUsers)
      }
    } catch (error) {
      throw error
    }
  }
  //*********** reset passwords  ********/

  passwordReset = async (req, res) => {
    const { email } = req.body;

    const { error } = userschema.resetLink.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }


    const user = await userModel.User.findOne({
      where: { email },
    });

    try {
      if (!user) {
        return res.status(404).json({ msg: "User does not exist" });
      }

      // const passwordLink = "www.gmail.com";
      let randomText = await randompassword.generateRandomPassword(50);
      let transporter = await  nodemailer.createTransport({
        host: "mail.skilltopims.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: {
          name: "IMS password reset link",
          address: process.env.EMAIL_USER,
        },
        to: user.email,
        subject: "IMS Reset link",
        text: "Click on the link to proceed with the password reset",
        html: `<a href='https://skilltopims.com/passwordConfirmation'>Click here to reset your password: ${randomText}</a>,`, // html body
      };

      res.json({
        msg: "An email has been sent to you with a link to reset your password. If not seen in your inbox, please check your spam.",
      });

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };

  //**********route to submit reset password and redirect to login */

  resetSubmit = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
//validate details
    const { error } = userschema.validatePasswordReset.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }
    const user = await userModel.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send("Enter a correct email address");
    }
    if (password !==confirmPassword){
      return res.json({msg: "Password mismatch"})
    }
    const hash = await bcrypt.hash(password, 10);
    const updatePassword = await userModel.User.update(
      { password: hash },
      { where: { email: email } }
    );
    try {
      if (!updatePassword) {
        return res.status(404).json({ msg: "Password reset failed" });
      } else {
        console.log(updatePassword);
        res.status(201).json({ msg: "Password updated successfully" });
        // return res.redirect('https://www.example.com')
        return
      }
    } catch (error) {
      throw error;
    }
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

    const staffExist = await userModel.Staff.findOne({
      where: {
        [Op.or]: [{ username: userName }, { email: email }],
      },
    });

    /******hash password***** */
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      if (userExist||staffExist) {
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
    const staff = await userModel.Staff.findOne({ where: { email } });
    if (!user && !staff) {
      return res.status(400).send("Email is not registered");
    }

    const account = user || staff


    const isMatch = await bcrypt.compare(password, user.password || staff.password);
    try {
      if (!isMatch) {
        return res.status(404).json({ msg: "Incorrect login details" });
      } else {

         // ******************Create JWT token ***********************

        const token = jwt.sign({id: user.userId|| staff.staffId, email: account.email, role: account.role}, process.env.SECRET_KEY, { expiresIn: '1h' })
        res.json({token, id: account.id, email: account.email, role:account.role });
        
          
      

        // res.cookie("token", token, {
        //   httpOnly: true,
        // })
         // return res.status(200).json({ msg: "Authentication success" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  homePage = async (req, res) =>{
    
    // Protected route example
    res.send(`Welcome`);
  }


  logout = async (re, res)=>{

    res.json({msg:'Logged out successfully.'}); // Inform the user
  }

}

//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;

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

//************* User Object ***************** */

class UserObject {
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

      const passwordLink = "www.gmail.com";
      const randomText = await randompassword.generateRandomPassword(50);
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
        to: email,//"jakpan64@yahoo.com", //req.body.email,
        subject: "IMS Reset link",
        text: `Click on the link to proceed with the password resert: ${passwordLink}`,
        html: `<a href='https://example.com'>Click here to reset your password: ${randomText}</a>,`, // html body
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

    const { error } = userschema.validatePasswordReset.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
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

         // ******************Create JWT token ***********************
        // const token = 
        return jwt.sign({ email}, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token)=>{
          // res.json({ token });
          res.json({ message: 'Login successful', token });
        });

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

  // app.post('/logout', (req, res) => {
  //   // Invalidate the token on client side (no server-side action needed)
  //   res.send('Logged out successfully.'); // Inform the user
  // });
}

//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;

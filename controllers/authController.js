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

      const formLink = ""

      let mailOptions = await {
        from: {
          name: "IMS password reset link",
          address: process.env.EMAIL_USER,
        },
        to: user.email,
        subject: "IMS Reset link",
        text: `You have made a request to change a password. Kindly Click on the link to proceed with the password reset`,
        html:` <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your IMS account. If you made this request, please click the button below to reset your password:</p>
          <a href="${process.env.CLIENT2_URL}/passwordConfirmation?token=${randomText}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>Best regards,<br/>IMS Support Team</p>
          </div>`,
       
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

  signup = async (req, res) => {
    const { userName, email, password} = req.body;

    // **Block new users from signing up**
    const allowNewUsers = false; 
    if (!allowNewUsers) {
        return res.status(403).json({ msg: "New users not allowed, Please contact support" });
    }

    // ********validation ***********/
    const { error } = userschema.userValidation.validate(req.body);
    if (error) {
        return res.status(404).json(error.details[0].message);
    }

    // *********check if user exist ********/
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

    // ******hash password***** /
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        if (userExist || staffExist) {
            return res
                .status(404)
                .json({ msg: "A User with these details already exists" });
        }
    } catch (error) {
        throw error;
    }

    // *********create user if none exist ****** /
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


    const isMatch = await bcrypt.compare(password, account.password);
    try {
      if (!isMatch) {
        return res.status(404).json({ msg: "Incorrect login details" });
      } else {

         // ******************Create JWT token ***********************
        let id;
        if(user){
          id=user.userId
        }else{
          id=staff.staffId
        }
        let permission
        if (staff) {
          permission=staff.permissions
        };
        console.log( "authpermission", permission);
        console.log( "email", account.email);
        const token = jwt.sign({id, username: account.username|| account.userName, email: account.email, role: account.role, permission}, process.env.SECRET_KEY, { expiresIn: '1h' })
        res.json({token, id: id, username: account.username|| account.userName, email: account.email, role:account.role });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  //*********change staff password */
  changePassword = async (req, res) => {
    const { email, oldPassword, password, confirmPassword } = req.body;
    
    //validate details
    const { error } = userschema.changePassword.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }

    //**********queery to check if user exist */
    const user = await userModel.User.findOne({ where: { email } });
    const staff = await userModel.Staff.findOne({ where: { email } });
    
    const account = user || staff
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {return res.status(404).json({ msg: "current password is incorrect" });}
    if (!account) {
      return res.status(400).send("User does not exist");
    } 
    if (password !== confirmPassword) {
      return res.json({ msg: "New passwords does not match match" });
    }
//update code

    const hash = await bcrypt.hash(password, 10);
    try {
      const userPasswordUpdate = await userModel.User.update(
        { password: hash },
        { where: { email: email } }
      );

      const staffPasswordUpdate = await userModel.Staff.update(
        { password: hash },
        { where: { email: email } }
      );

      if(userPasswordUpdate || staffPasswordUpdate){
        return res
          .status(200)
          .json({ msg: "User password updated successfully" });
      }else{
        return res
          .status(404)
          .json({ msg: "Password update failed" });
      }
      
    } catch (error) {
      return error
    }
  };//end of method





  //logout
  logout = async (req, res)=>{
    res.json({msg:'Logged out successfully.'}); // Inform the user
  }

}

//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;

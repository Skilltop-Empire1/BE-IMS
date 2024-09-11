//************** Import libraries ************ *
const userModel = require("../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs")
const userschema = require("../validations/userValidation") 
const Joi = require("joi")
const loginAuthourization = require("../middlewares/authMiddleware")

//************* User Object ***************** */

class UserObject {
  //********* signup method ************** */

  signup = async (req, res) => {
    const { userName, email, password } = req.body;

    //********validation ***********/
    const { error } = userschema.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }

    //*********check if user exist ********/
    const userExist = await userModel.User.findOne({
      where: {
        [Op.or]: [{ userName: userName }, { email: email }],
      },
    });

    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      if (userExist) {
        return res.status(404).json({ msg: "A User with these details already Exist" });
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
        return res.status(201).json({ msg: "User created successfully" });
      }
    } catch (error) {
      throw error;
    }
  };


  
//************user signin  ***********/

login = async (req, res) =>{
    const {email, password} = req.body

    //************check for user ************ */

    const user = await userModel.User.findOne({
        where:{email}
    })
    try {

        //********if user login is wrong */
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({msg: "Incorrect username or password"})
        }

        const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: '1h'})
        res.json({token})

        //********if correct details ******/
    } catch (error) {
        throw error
    }
}






}





//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;

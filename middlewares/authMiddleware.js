//********import lib rarides */
const jwt = require("jsonwebtoken");
require("dotenv").config()

const loginJWTAthentication = (req, res, next) => {

  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }




// const token = req.cookies.token
// try {
//   const user = jwt.verify(token, process.env.SECRET_KEY) 
//   req.user = user
//   next()
// } catch (error) {
//   res.clearCookie("token")
//   return res.send(err)
//   // res.redirect("/")
  
// }


};

module.exports = loginJWTAthentication

// // Sign-in endpoint
// app.post('/signin', async (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username);
    
//     if (!user) {
//         return res.status(401).send('Invalid username or password');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(401).send('Invalid username or password');
//     }

//     const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
//     res.json({ token });
// });

// // Middleware to authenticate JWT
// const authenticateJWT = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (token) {
//         jwt.verify(token, SECRET_KEY, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

// // Protected route example
// app.get('/protected', authenticateJWT, (req, res) => {
//     res.send('This is a protected route');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express")
require("dotenv").config()
const morgan = require("morgan")
const cors = require("cors")
const cron = require("node-cron")
const axios = require("axios")
const http = require("http")
const path = require('path')

const { initializeSocket } = require("./config/socket")
const app = express()
const server = http.createServer(app)

const io = initializeSocket(server)
if (io) {
  console.log("Socket.io initialized successfully");
} else {
  console.error("Socket.io initialization failed");
}

require("./models")
const {  swaggerUi,swaggerSpec} = require("./swagger")

const whiteList = [process.env.CLIENT_URL, process.env.CLIENT2_URL,'http://localhost:5173']

const corsOptions = {
    origin:function (origin,callback){
      if(whiteList.indexOf(origin) !==-1 || !origin){
        callback(null,true)
      }else{
        callback(new Error("Not allowed by CORS"))
      }
    } ,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  };

const port = process.env.PORT || 5000
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(morgan("tiny"));

app.use('/photo', express.static(path.join(__dirname, 'photo')))

const userRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const productRoute = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const storeRoute = require("./routes/storeRoutes");
const salesRecordRoute = require("./routes/salesRoutes");
const staffRoute = require("./routes/staffRoutes");
const notificationRoute = require("./routes/notificationRoutes")

const errorHandler = require("./error/errorHandler")
const notFoundError = require("./error/notFoundError")

app.use("/api/IMS/user", userRoute);
app.use("/api/IMS/profile", profileRoute);
app.use("/api/IMS/product", productRoute);
app.use("/api/IMS/category", categoryRoute);
app.use("/api/IMS/store", storeRoute);
app.use("/api/IMS/sales", salesRecordRoute);
app.use("/api/IMS/staff", staffRoute);
app.use("/api/IMS/notification", notificationRoute);



cron.schedule('*/30 * * * *', async ()=> {
  try {
    const response = await axios.get(process.env.CLIENT_URL)
    console.log("update successful", response.status)
  } catch (error) {
    console.error("failed to update tasks", error.message)
  }
})


// Serve the Swagger docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/photo', express.static(path.join(__dirname, 'photo')));

app.get('/logo', (req, res) => {
  res.sendFile(path.join(__dirname, 'photo', 'logo.PNG'), (err) => {
    if (err) {
      res.status(err.status).end();
    } else {
      console.log('Sent:', 'logo.PNG');
    }
  });
});


//for underfined routes
app.use(notFoundError)
//global error hander
app.use(errorHandler)
app.set("io",io)
const startServer = async () => {
    try {
      server.listen(port, () => {
        console.log(`App is listening on port ${port}`);
      });
    } catch (error) {
      console.error("Error starting the server:", error.message);
    }
  };
  
  
  startServer();

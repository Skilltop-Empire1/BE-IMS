const express = require("express")
require("dotenv").config()
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const cron = require("node-cron")
const axios = require("axios")
const {swaggerUi,swaggerSpec} =  require("./swagger")

require("./models")



const corsOptions = {
    origin: [process.env.CLIENT_URL, "*"],
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

const userRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const productRoute = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const storeRoute = require("./routes/storeRoutes");
const salesRecordRoute = require("./routes/salesRoutes");

app.use("/api/IMS/user", userRoute);
app.use("/api/IMS/profile", profileRoute);
app.use("/api/IMS/product", productRoute);
app.use("/api/IMS/category", categoryRoute);
app.use("/api/IMS/store", storeRoute);
app.use("/api/IMS/sales", salesRecordRoute);



// cron.schedule('*/2 * * * *', async ()=> {
//   try {
//     const response = await axios.get(process.env.BACKEND_SERVER)
//     console.log("update successful", response.status)
//   } catch (error) {
//     console.error("failed to update tasks", error.message)
//   }
// })

const startServer = async () => {
    try {
      app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
      });
    } catch (error) {
      console.error("Error starting the server:", error.message);
    }
  };
  
  
  startServer();
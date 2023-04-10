//External Imports ......
const express = require("express"); 
const {success, error } = require("console"); 
const dotenv = require("dotenv");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require('cors'); 
const bodyParser = require('body-parser'); 

// Internal Imports ....  
const connectDB = require("./db"); 
const {notFoundHandler,errorHandler } = require("./middleware/common/errorHandler"); 

// Routes Data import ....
const auth = require("./routes/loginRoute");
const users = require("./routes/usersRoute");
const category = require("./routes/categoryRoute");
const image = require("./routes/imageRoute");
const slider = require("./routes/sliderRoute");
const tags = require("./routes/tagsRoute"); 
const alldata = require("./routes/dashboardRoute");

//config ....... 
const app = express();
const corsOptions = {
  credentials: true
}
app.use(cors(corsOptions)); 
dotenv.config();
const server = http.createServer(app);

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
//body-parser 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

// Routing Setup .........
app.use("/api", auth);
app.use("/api/users", users);
app.use("/api/category",category);
app.use("/api/slider",slider);
app.use("/api/image",image); 
app.use("/api/tags",tags)
app.use("/api/alldata",alldata);

// 404 not found handler
app.use(notFoundHandler);

// common Error Handler
app.use(errorHandler);

const start = async ()=>{
  try {
        connectDB();
        server.listen(process.env.PORT); 
        console.log(`App is running on http://localhost:${process.env.PORT}`,);
  } catch (err) {
    error(`Opps ! failed to connect the server ${err}`,
      );
    
  }
}
module.exports = start; 

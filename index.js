const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');

const cors = require('cors');

// config env. variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const app = express();

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// connect to db
mongoose.connect(process.env.MONGO_URI,  
    {
        useNewUrlParser: true,
        useCreateIndex : true
    })
.then(() => console.log('DB Connected'));


// routes
app.use("/api", authRoutes);
app.use("/api", contactRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT);




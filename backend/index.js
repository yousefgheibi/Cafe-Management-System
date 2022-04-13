   const express = require('express');
   const bodyParser = require("body-parser");
   const cors = require('cors');
   const connection = require("./connection");
   const userRoute = require("./routes/user");
   const app =  express();

   app.use(cors());
   app.use(bodyParser.json());

   app.use('/user',userRoute);
 
   module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const database = require("./config/database");
require("dotenv").config();
const routerApiV1 = require("./api/v1/router/index.route");
const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json())

// Cookie-parser
app.use(cookieParser());

// Connect database
database.connect();

// Routes Version 1
routerApiV1(app);



app.listen(port, () => {
  console.log(`App listening to port ${port}`);
})
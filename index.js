const express = require('express');

const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const expressValidator = require('express-validator');
const swaggerDocument = require('./swagger.json');
const tutorialpostRoutes = require('./routes/tutorial');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => console.log('DB Connected'));

mongoose.connection.on('error', (err) => {
  console.log(`DB Connection error : ${err.message}`);
});

const myOwnMiddleware = (req, res, next) => {
  console.log('middleware applied');
  next();
};
app.use(bodyParser.urlencoded({ extended: true }));
//  middleware
app.use('/swagger-api', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`The server is running on port : ${port}`);
});

app.use(morgan('dev'));
app.use(expressValidator());
app.use(myOwnMiddleware);
app.use(express.json());
app.use('/tutorials', tutorialpostRoutes);
app.use('/users', tutorialpostRoutes);

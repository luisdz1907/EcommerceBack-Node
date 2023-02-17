const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

dbConnect();

app.use(morgan('dev'))
//Parseamos los datos
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

//Cookie
app.use(cookieParser())

//Rutas
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);

//ErrosHandler
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}!`);
});

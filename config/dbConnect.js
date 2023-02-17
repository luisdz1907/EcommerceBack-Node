const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log('Conectado con exito a la BD!!!')
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;

const mongoose = require("mongoose");
const validateMongId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("El ID es invalido");
};

module.exports = validateMongId;

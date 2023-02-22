const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToke");
const validateMongId = require("../utils/validateMongoId");
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("El usuario ya existe");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);

    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
    
  } else {
    throw new Error("Credenciales invalidas");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if(!cookie?.refreshToken) throw new Error('Not Refresh Token in Coockies')
  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
if (!user) {
  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:true
  })
  return res.sendStatus(204)
}
await User.findOneAndUpdate(refreshToken,{
  refreshToken: ""
})
res.clearCookie("refreshToken",{
  httpOnly:true,
  secure:true
})
return res.sendStatus(204)
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if(!cookie?.refreshToken) throw new Error('Not Refresh Token in Coockies')
  const refreshToken = cookie.refreshToken

  const user = await User.findOne({ refreshToken })
  if(!cookie?.refreshToken) throw new Error('Not hay usuario con ese token')
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
    if (err || user.id !== decoded.id) {
      throw new Error('Ocurrio un error al refrescar el token')
    }
    const accessToken =  generateToken(user?._id)
    res.json({
      accessToken: accessToken
    })
  })
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongId(id);
  try {
    const getUser = await User.findById(id);
    res.json({
      user: getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      user: deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({
      message: "Usuario bloqueado",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({
      message: "Usuario desbloqueado",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser
};

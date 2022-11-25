const jwt = require("jsonwebtoken");
const User = require('../model/user');

// const config = process.env;
const verifyToken = async(req, res, next)=>{
    let token = req.headers.authorization;
    if (token) {
        const secret = process.env.JWT_SECRET;
        try {
          const verificationResponse = jwt.verify(token, secret);
          const id = verificationResponse.user_id;
          const user = await User.findById(id);
          if (user) {          
            req.user = user;
          } else {
            return res.status(401).send("Invalid Token");
        }
        } catch (error) {
            return res.status(401).send("Invalid Token");
        }
      } else {
        return res.status(401).send("missing Token");
    }
  return next();
};
 const createToken =(user, expireAt)=> {
    const expiresIn = expireAt ? expireAt : 60 * 60 * 24; // 24 hour(default)
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

module.exports = verifyToken;
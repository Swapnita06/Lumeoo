const jwt = require('jsonwebtoken')
// module.exports= async (req,res,next)=>{
//     try{
//     const token = req.headers.authorization.split(" ")[1]
//     await jwt.verify(token,'swapnita singh')
//     next()
//     }
//     catch(err){
//  console.log(err)
// return res.status(500).json({
//  error:'invalid token'
//     })
// }
// }

const checkAuth = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header
      if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
      }
  
      const decoded = jwt.verify(token, 'swapnita singh'); // Verify the token
      req.user = decoded;  // Attach user info to the request
      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
  module.exports = checkAuth;
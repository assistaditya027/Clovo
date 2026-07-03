import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info in request
    req.userId = decoded.id;
    // Ensure req.body exists and override any client-supplied userId
    req.body = req.body || {};
    req.body.userId = decoded.id;

    // Move to next middleware
    next();
  } catch (error) {
    if (error.message !== 'jwt expired') {
      console.log(error.message);
    }

    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;

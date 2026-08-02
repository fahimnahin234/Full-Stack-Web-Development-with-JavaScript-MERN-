const jwt = require('jsonwebtoken');

// Creates a JWT and sends it both as an httpOnly cookie and in the JSON body,
// so the API works for cookie-based clients (browsers) and header-based
// clients (Postman, mobile apps) alike.
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE_DAYS) || 7;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true, // not accessible via client-side JS - protects against XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    },
  });
};

module.exports = sendTokenResponse;

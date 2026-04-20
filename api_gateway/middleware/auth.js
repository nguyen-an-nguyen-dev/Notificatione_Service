const jwt = require('jsonwebtoken')

const SECRET_KEY = 'your_jwt_secret'

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'No token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET_KEY)

    req.user = {
      userId: decoded.userId || decoded.id || decoded.sub
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware
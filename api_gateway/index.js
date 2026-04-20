const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')

const app = express()
app.use(cors())

//public route
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}))

//protected routes
app.use('/api/chat', authMiddleware, createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}))

app.use('/api/user', authMiddleware, createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}))

app.listen(3000, () => {
  console.log('API Gateway running on port 3000')
})
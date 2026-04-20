const Redis = require('ioredis')
const redis = require('./redis')
const config = require('./config')

// Tạo 1 connection riêng để subscribe (không dùng chung với redis command)
const sub = new Redis()

// Subscribe vào channel NEW_MESSAGE (tên lấy từ config)
sub.subscribe(config.CHANNEL)

console.log('Listening for NEW_MESSAGE...')

// Lắng nghe event từ Redis
sub.on('message', async (channel, message) => {
  try {   
    // Parse dữ liệu JSON từ message (do Chat Service gửi)
    const raw = JSON.parse(message)

    // Normalize event (tránh phụ thuộc trực tiếp vào format bên Chat Service)
    const event = {
      receiverId: raw.receiverId,
      content: raw.content
    }

    console.log('Received event:', event)

    // Kiểm tra trạng thái online của user trong Redis
    const isOnline = await redis.get(
      config.REDIS_KEYS.ONLINE(event.receiverId)
    )

    // Nếu user đang online → không gửi notification
    if (isOnline === 'true') {
      console.log('User online → skip notification')
      return
    }

    // Nếu user offline → gửi notification (hiện tại chỉ log)
    console.log('Send notification:', event.content)



  } catch (err) {
    // Bắt lỗi khi parse JSON hoặc xử lý event
    console.error('Error processing event:', err)
  }
})
module.exports = {
  CHANNEL: 'NEW_MESSAGE',

  REDIS_KEYS: {
    ONLINE: (userId) => `user:${userId}:online`,
    DEVICE_TOKEN: (userId) => `user:${userId}:deviceToken`
  }
}
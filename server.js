const app = require("./src/app");

const PORT = process.env.PORT || 3052

const server = app.listen(PORT, () => {
  console.log('WSV eCommerce start with port')
})

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express ${PORT}`))
})
const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const router = require('./router/router')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(router)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
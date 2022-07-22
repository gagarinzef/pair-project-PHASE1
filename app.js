const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const session = require('express-session')
const router = require('./router/router')

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'gaganyund',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //karena masih development
    sameSite: true
  }
}))

app.use(router)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
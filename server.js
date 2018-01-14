const express = require('express')
const app = express()
const router = require('./routes/routes')

app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(router)

//default catch all error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', { error: err })
})

app.listen(3000 || process.env.PORT)

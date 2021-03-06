const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//passort
require('./config/passport')(passport)


// DB connection
const url = 'mongodb://localhost:27017/NodeMailer'
mongoose.connect(url, ({useUnifiedTopology: true, useNewUrlParser: true}))
.then(() => console.log('DB connected!'))
.catch((err) => console.log(`DB connection error ${err}`))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//bodyParser
app.use(express.urlencoded({ extended: true }))

//session
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())


app.use((req, res, next) =>{
    res.locals.success_msg =  req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    
    next()
})

//Router
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 1000

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
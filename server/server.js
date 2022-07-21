const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./src/api/database')
const Role = db.role
require('dotenv').config()
const dbConfig = require('./src/api/config/db.config')

db.mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connect to MongoDB successfully.')
        initial()
    })
    .catch((err) => {
        console.error('Connection error', err)
        process.exit()
    })

const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user',
            }).save((err) => {
                console.log('error', err)
            })
            console.log("added 'user' to roles collection")
            new Role({
                name: 'moderator',
            }).save((err) => {
                console.log('error', err)
            })
            console.log("added 'moderator' to roles collection")
            new Role({
                name: 'admin',
            }).save((err) => {
                console.log('error', err)
            })
            console.log("added 'admin' to roles collection")
        }
    })
}

var corsOptions = {
    origin: 'http://localhost:8081',
}
app.use(cors(corsOptions))
// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// route
require('./src/api/v1/user/user.routes')(app)
require('./src/api/v1/auth/auth.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

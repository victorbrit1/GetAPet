const express = require('express')
const cors = require('cors')
require('./db/conn')

const app = express()

app.use(express.json())

//solve CORS
app.use(cors({credentials: true, origin:'http://localhost:3000'}))

//public folder for images 
app.use(express.static('public'))

//routes
const UserRoutes = require('./routes/UserRoutes')

app.use('/users',UserRoutes)


app.listen(5000)
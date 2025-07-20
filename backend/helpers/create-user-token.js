const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createUserToken = async (user,req,res) => {
    const token = jwt.sign({
        name: user.name,
        id:user._id
    }, "nossosecret")

    // return token 
    res.status(200).json({
        message:"Voce está autenticado",
        token: token,
        userId: user._id,
    })
}

module.exports = createUserToken
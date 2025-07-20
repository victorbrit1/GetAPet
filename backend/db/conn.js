const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Conection secured')
}

main().catch((err) => console.log(err))

module.exports =  mongoose
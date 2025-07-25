const Pet = require('../models/Pet')

//helpers
const getToken = require("../helpers/get-tolken")
const getUserByToken = require("../helpers/get-user-by-token")


module.exports = class PetController{
    //create a pet

    static async create(req,res){

        const {name,age,weight,color} = req.body

        const images = req.files

        const available = true

        //images upload

        //validations
        if(!name){
           res.status(422).json({message: 'o nome é obrigatório'})
           return
        }

        if(!age){
           res.status(422).json({message: 'a idade é obrigatória'})
           return
        }

        if(!weight){
           res.status(422).json({message: 'o peso é obrigatório'})
           return
        }

        if(!color){
           res.status(422).json({message: 'a cor é obrigatória'})
           return
        }

        console.log(images)

        if(images.length === 0){
           res.status(422).json({message: 'a imagem é obrigatória'})
           return
        }

        //get user (pet owner)
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user:{
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) =>{
            pet.images.push(image.filename)
        })

        try{
            const newPet = await pet.save()
            res.status(201).json({message: 'Pet cadastrado com sucesso!',
                newPet,
            })

        }catch(error){
            res.status(500).json({
                message: error
            })
        }
    }

    static async getAll(req,res){

        const pets = await Pet.find().sort("-createdAt") 
       
       
        res.status(200).json({
            pets: pets,
        })
    }

    static async getAllUserPets(req,res){

        //get user from token
        const token = getToken(req)
        const user = getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdat')

        res.status(200).json({
            pets,
        })

    }

}
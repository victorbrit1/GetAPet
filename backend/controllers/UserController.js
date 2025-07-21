const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-tolken')
const createUserToken = require('../helpers/create-user-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{

    static async register(req,res){
        const {name, email, phone, password,confirmpassword} = req.body ||{}
        
        //validations
        if(!name){
            res.status(422).json({message: 'o nome é obrigatório'})
            return
        }        
        if(!email){
            res.status(422).json({message: 'o email é obrigatório'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'o fone é obrigatório'})
            return
        }
        if(!password){
            res.status(422).json({message: 'a senha é obrigatória'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'a confirmação de senha é obrigatória'})
            return
        }
        if(confirmpassword !== password){
            res.status(422).json({message: 'senha e a confirmação de senha devem ser iguais'})
            return
        }
        //check if user exists
        const userExists = await User.findOne({email: email})
        if(userExists){
            res.status(422).json({message: 'E-mail indisponível'})
            return
        }

        //geração de senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name : name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try{

            const newUser = await user.save()
            
            await createUserToken(newUser,req,res)
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async login(req,res){
        const {email, password} = req.body
        if(!email){
            res.status(422).json({message:'O e-mail é obrigatório'})
            return
        }

        if(!password){
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }
        //check if user exists
        const user = await User.findOne({email: email})
        if(!user){
            res.status(422).json({message: 'Não existe usuário cadastrado com esse e-mail'})
            return
        }
        //check if password match with db password
        const checkedPassword = await bcrypt.compare(password,user.password)
        if(!checkedPassword){
            res.status(422).json({message: 'Senha incorreta'})
        }

        await createUserToken(user,req,res)
    }

    static async checkUser(req,res){
        let currentUser

        console.log(req.headers.authorization)
        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token,'nossosecret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req,res){

        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if(!user){
            res.status(422).json({message: 'Usuário não econtrado',})
            return

        }
        res.status(200).json({user})
    }

    static async editUser(req,res){
        res.status(200).json({message: 'Deu certo update!',})
        return

    }

    static async editUser(req,res){
        const id = req.params.id

       

        //check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name,email,phone,password,confirmpassword} = req.body

        let image = ''

        if(req.file){
            user.image = req.file.filename
        }

        //validations
        if(!name){
            res.status(422).json({message: 'o nome é obrigatório'})
            return
        }       
        user.name = name

        if(!email){
            res.status(422).json({message: 'o email é obrigatório'})
            return
        }

        //checking if email is already taken
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor utilize outro e-mail',})
            return

        }
        user.email = email
        if(!phone){
            res.status(422).json({message: 'o fone é obrigatório'})
            return
        }

        user.phone = phone

        if(confirmpassword !== password){
            res.status(422).json({message: 'senha e a confirmação de senha devem ser iguais'})
            return
        }
        else if(password === confirmpassword && password!= null){

            //creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password,salt)

            user.password = passwordHash
        }
        
        try{

            //return user updated data
            await User.findOneAndUpdate(
                { _id: user.id },
                { $set: user },
                 {new: true },
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
            })

            
        }catch(error){

            res.status(500).json({message : error})
            return
            
        }



    }
}
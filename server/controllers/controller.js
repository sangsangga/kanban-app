const {User} = require('../models/index')
const {compare} = require('../helpers/encryption')
const {tokenize} = require('../helpers/tokenization')


class Controller {
   static async login(req,res){
      const payload = {
         email:req.body.email,
         password:req.body.password
      }

      try {
         let user = await user.findOne({where:{email:payload.email}})
         if(user){
            if(compare(payload.password,user.password)){
               const access_token = tokenize({id:user.id,email:user.email})
               res.status(200).json({access_token})
            }else{
               throw({
                  status:400,
                  message:'Wrong email/password'
               })
            }
         }else{
            throw({
               status:400,
               message:'Wrong email/password'
            })
         }
      } catch (error) {
         console.log(error)
      }

   }
   
   static async register(req,res){
      const payload = {
         email:req.body.email,
         password:req.body.password
      }

      try {
         let duplicate = await User.findOne({where:{email:payload.email}})
         if(duplicate)
            throw{
               status:400,
               message:'Email Already In Use!'
            }
         let user = await User.create(payload,{returning:true})
         res.status(201).json({data:user})
      } catch (error) {
         if(error.status){
            res.status(error.status).json({message:error.message})
         }else{
            res.status(500).json({message:'Server Error'})
         }
      }


   }
}

module.exports = Controller
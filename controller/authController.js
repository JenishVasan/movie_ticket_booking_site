const User  = require('../model/userModel')
const bcrypt = require('bcrypt')
const welcomMailSender = require('../utils/welcomeEmail')

const login = (req,res)=>{
    res.render('pages/login')
}

const register = (req,res)=>{
    res.render('pages/register')
}

const userRegister = async (req,res)=>{

    const user = await User.findOne({email :req.body.email})

    if(user){
        console.log("User Already Registered with this email")
        return res.redirect('/login')
    }

    if(req.body.password != req.body.confirmPassword){
        console.log('password and confirm password not matched')
        return res.redirect('/register')
    }

    try{
        const {userName ,email , password} = req.body

        const hashPass = await bcrypt.hash(password, 10)
        console.log(hashPass)
        const user = await new User({userName , email , password : hashPass })
        await user.save()
        // console.log(user)
        console.log("sending mail to user from register")
        // send email to user
        welcomMailSender(email , userName)
        console.log('mail sended to the user , redirect user to login page')

        return  res.redirect('/login')
    }catch(err){
        console.log(err)
    }

}

const userLogin =async (req,res)=>{
  
    const setCookie = ()=>{
        res.cookie("userId", user._id , {
            httpOnly: false,
            secure: false, 
            sameSite: "strict" ,
        })
    }
    const user = await User.findOne({email : req.body.email})
    // console.log('login : user :-' , user)
    // console.log('login : body :-' , req.body)
    
    if(!user){
        console.log('login : user not found with this Email')
        return res.redirect("/register")
        
    }

    const rightPass = await  bcrypt.compare(req.body.password, user.password )

    if(!rightPass){
        console.log('password is wrong , try again')
        setCookie()
        return res.redirect('/login')
    }

    if(user.role === "admin"){
        console.log("user login success")
        res.redirect('/Admin')
    }else if(user.role === "user"){
        
        console.log("sending mail to user from login")
        welcomMailSender(user.email ,user.userName)
        setCookie()
        res.redirect('/')
    }
    // send mail to user
}

module.exports ={login , register , userRegister , userLogin}
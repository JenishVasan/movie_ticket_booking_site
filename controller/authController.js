const User  = require('../model/userModel')
const bcrypt = require('bcrypt')
const welcomMailSender = require('../utils/welcomeEmail')
const { findByIdAndUpdate } = require('../model/moviewmodel')

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

        if(email == "hjenis451@gmial.com"){
            let admin = await User.findOne({email : "hjenis451@gmail.com"})
            await findByIdAndUpdate(admin._id , {role : "admin"})
        }
        
        console.log("sending mail to user from register")
     
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
     
    if(!user){
        console.log('login : user not found with this Email redirecting to register page')
        return res.redirect("/register")
    }

   
    const rightPass = await  bcrypt.compare(req.body.password, user.password )

    if(!rightPass){
        console.log('password is wrong , try again')
        return res.redirect('/login')
    }
    setCookie()
    console.log(user.email , user.userName)
    console.log("sending email ")
    welcomMailSender(user.email , user.userName)
    res.redirect('/')
    

}

const logOut = (req,res)=>{
    res.clearCookie("userId");
    console.log("logout controller")
    return res.redirect("/login")
}

module.exports ={login , register , userRegister , userLogin , logOut}
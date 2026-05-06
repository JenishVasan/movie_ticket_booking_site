
const checkLogin = (req,res,next)=>{
    console.log("cookies" , req.cookies)
    if(req.cookies.userId){
        return res.redirect('/')
    }
    next()
}

module.exports = checkLogin
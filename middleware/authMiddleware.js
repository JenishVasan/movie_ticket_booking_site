const authMiddleware = (req,res,next)=>{

    if(!req.cookies.userId){
         console.log('auth Middleware : user not logged in ')
        return res.redirect('/login')
    }
    next()
}

module.exports = authMiddleware
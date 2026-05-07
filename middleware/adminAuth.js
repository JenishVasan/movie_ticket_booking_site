const authMiddleware = (req,res,next)=>{
    if(!req.cookies.admin){
        return res.redirect('/login')
    }
    next()
}

module.exports = authMiddleware
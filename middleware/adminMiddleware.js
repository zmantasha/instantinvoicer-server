const verifyAdmin=async(req,res,next)=>{
    try {
        console.log(req.user)
        const admin=req.user.roles[0]
        console.log(admin)
       if(!admin) return res.status(401).json("admin is not access")
        res.user=admin
        next()
    } catch (error) {
      console.log(error)     
    }
    }
    
    module.exports=verifyAdmin
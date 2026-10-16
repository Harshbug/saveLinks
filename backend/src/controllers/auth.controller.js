const authService = require('../services/auth.service.js')

const authController = {
  //register function
  register: async (req, res) => {
    const { username, email, password } = req.body
    const user = await authService.register({ username, email, password })
    res.status(201).json({ success: true, data: user })
  },


  // you write this
  // call authService.login, send back user + tokens
  //login fucntion
  login: async (req, res) => {
    const { email, password } = req.body;
    //now check if the email and password are correct
    const result = await authService.login({ email, password })
    res.status(200).json({ success: true, data: result })
  },
  //log out function
  logout: async (req, res) => {
    await authService.logout(req.user.userId)
    res.status(200).json({ success: true, message: 'Logged out' })
  },
  //refresh function
  refresh:async (req,res)=>{
    const {refreshToken}=req.body;
    const result=await authService.refresh(refreshToken);
    res.status(200).json({success:true,data:result});
  }
}

module.exports = authController
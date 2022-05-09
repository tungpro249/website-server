const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {

    //đăng ký [POST]/api/register
    register: async (req, res) =>{
        try {
            const {name, email, password} = req.body;

            // kiểm tra trong db tồn tại mật khẩu, email
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "Email đã tồn tại."})

            if(password.length < 6) 
                return res.status(400).json({msg: "Password tối thiểu 6 kí tự."})

            // Mã hóa pass
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })

            // Save mongodb
            await newUser.save()

            // tạo refreshtoken
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //đăng nhập [POST]/api/login
    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "Tài khoản không tồn tại."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Mật khẩu không chính xác."})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // đăng xuất [GET]/api/logout
    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Đăng xuất."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //[GET]/api/refresh_token
    refreshToken: (req, res) =>{
        try {
            // lấy token lưu ở cookies
            const rf_token = req.cookies.refreshtoken;

            // kiểm tra token
            if(!rf_token) return res.status(400).json({msg: "Hãy đăng kí hoặc đặng nhập"})

            // xem token có hợp lệ hay k
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Hãy đăng kí hoặc đặng nhập"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },

    // [GET]/api/infor
    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "Người dùng không tồn tại."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // [PATCH]/api/addcart
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "Người dùng không tồn tại."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Thêm vào giỏ hàng"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // [GET]/api/history
    history: async(req, res) =>{
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
 }


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl


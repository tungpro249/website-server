const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

//register
router.post('/register', userCtrl.register)

//login
router.post('/login', userCtrl.login)

//logout
router.get('/logout', userCtrl.logout)

//refresh_token
router.get('/refresh_token', userCtrl.refreshToken)

//infor
router.get('/infor', auth,  userCtrl.getUser)

//addcart
router.patch('/addcart', auth, userCtrl.addCart)

//history
router.get('/history', auth, userCtrl.history)


module.exports = router
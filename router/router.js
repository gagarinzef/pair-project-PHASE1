const Controller = require('../controllers/controller')
const router = require('express').Router()
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    console.log(file)
    let fileName = ''

    if (file.originalname) {
      fileName = file.originalname.split(' ').join('_')
      cb(null, file.fieldname + '-' + uniqueSuffix + fileName)
    }
  }
})

const upload = multer({ storage: storage })




// router signUp
router.get('/signUp', Controller.signUpForm)
router.post('/signUp', Controller.signUpPost)

//router signIn
router.get('/signIn', Controller.signInForm)
router.post('/signIn', Controller.signInPost)


router.use(function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/signIn')
  } else {
    next()
  }
})

router.get('/', Controller.home)
router.get('/meme/add', Controller.addMemePage)
router.post('/meme/add', upload.single('imageURL'), Controller.addMeme)
router.get('/meme/:id', Controller.memeDetail)
router.post('/meme/:id', Controller.addComment)
router.get('/user/:id/profile', Controller.userProfile)
router.post('/user/:id/profile', Controller.userProfilePost)
router.get('/user/:id/account', Controller.userAccount)
router.post('/user/:id/account', Controller.userAccountPost)
router.get('/signOut', Controller.signOut)





module.exports = router
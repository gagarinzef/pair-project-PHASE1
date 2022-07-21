const Controller = require('../controllers/controller')
const router = require('express').Router()


// router signUp
router.get('/signUp', Controller.signUpForm)
router.post('/signUp', Controller.signUpPost)

//router signIn
router.get('/signIn', Controller.signInForm)
router.post('/signIn', Controller.signInPost)


router.use(function (req, res, next) {
  console.log(req.session.user);
  if (!req.session.user) {
    res.redirect('/signIn')
  } else {
    next()
  }
})

router.get('/', Controller.home)
router.get('/meme/add', Controller.addMemePage)
router.post('/meme/add', Controller.addMeme)
router.get('/meme/:id', Controller.memeDetail)
router.post('/meme/:id', Controller.addComment)
router.get('/meme/:memeId/delete/:commentId', Controller.delete)
router.post('/meme/:memeId/edit/:commentId', Controller.editComment)
router.get('/signOut', Controller.signOut)





module.exports = router
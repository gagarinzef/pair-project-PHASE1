const Controller = require('../controllers/controller')
const router = require('express').Router()

router.get('/', Controller.home)
router.get('/meme/add', Controller.addMemePage)
router.post('/meme/add', Controller.addMeme)
router.get('/meme/:id', Controller.memeDetail)
router.post('/meme/:id', Controller.addComment)



module.exports = router
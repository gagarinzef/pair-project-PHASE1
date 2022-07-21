const Controller = require('../controllers/controller')
const router = require('express').Router()

router.get('/', Controller.home)
router.get('/meme/:id', Controller.memeDetail)
router.post('/meme/:id', Controller.addComment)
router.get('/meme/add', Controller.addMemePage)



module.exports = router
const { Meme, MemeDetail, User, UserProfile, Tag} = require('../models')
const { timeSince } = require('../helper/helper')

class Controller{
    static home(req, res){
        const filter = req.query.filter
        
        let opt = {}
        if(filter){
            opt = {
                name: filter
            }
        }

        let meme;
        let tag;
        Meme.findAll({
            order: [['createdAt', 'DESC']],
            include: [User, {
                model: Tag,
                where: opt
            }]
            })
            .then((data)=>{
                meme = data
                return Tag.findAll()
            })
            .then((data)=>{
                tag = data
                return MemeDetail.countComment()
            })
            .then((memeDetail)=>{
                // res.send(meme)
                res.render('home', {meme, tag, memeDetail})
            })
            .catch((err)=>{
                res.send(err)
            })

            // [[sequelize.fn('count', sequelize.col('comment')), 'count']]

        // MemeDetail.findAll()
        //     .then((data)=>{
        //         res.send(data)
        //     })
        //     .catch((err)=>{
        //         res.send(err)
        //     })
        
    }

    static memeDetail(req, res){
        const MemeId = +req.params.id
        
        let meme;
        Meme.findByPk(MemeId, {
            include: {
                model: User,
                attributes: ['id', 'userName']
            }
            })
            .then((data)=>{
                meme = data
                return MemeDetail.findAll({
                    where: {
                        MemeId
                    },
                    order: [['createdAt', 'DESC']]
                })
            })
            .then((detail)=>{
                // res.send(detail[0])
                res.render('meme', {meme, detail, timeSince})
            })
            .catch((err)=>{
                res.send(err)
            })
    }

    static addComment(req, res){
        const MemeId = +req.params.id
        const { comment } = req.body

        MemeDetail.create({ comment, MemeId, UserId: 5 })
            .then(()=>{
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err)=>{
                res.send(err)
            })
    }

    static addMemePage(req, res){
        Tag.findAll()
            .then((tag)=>{
                console.log(tag)
                res.render('add-meme', {tag})
            })
            .catch((err)=>{
                res.send(err)
            })
    }

    static addMeme(req, res){
        console.log(req.body)
        const { title, imageURL, TagId } = req.body

        Meme.create({
            title, 
            imageURL, 
            TagId,
            UserId : 1
            })
            .then(()=>{
                res.redirect('/')
            })
            .catch((err)=>{
                res.send(err)
            })
    }
}

module.exports = Controller
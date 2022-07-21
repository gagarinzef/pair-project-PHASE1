const { Meme, MemeDetail, User, UserProfile, Tag } = require('../models')
const bcrypt = require('bcryptjs')
const { timeSince } = require('../helper/helper')

class Controller {
    static home(req, res) {
        const user = req.session.user
        const filter = req.query.filter

        let opt = {}
        if (filter) {
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
            .then((data) => {
                meme = data
                return Tag.findAll()
            })
            .then((data) => {
                tag = data
                return MemeDetail.countComment()
            })
            .then((memeDetail) => {
                res.render('home', { meme, tag, memeDetail, user })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static memeDetail(req, res) {
        const query = +req.query.edit
        const MemeId = +req.params.id
        const user = req.session.user

        let meme;
        Meme.findByPk(MemeId, {
            include: {
                model: User,
                attributes: ['id', 'userName']
            }
        })
            .then((data) => {
                meme = data
                return MemeDetail.findAll({
                    attributes: ['id', 'comment', 'createdAt', 'UserId', 'MemeId'],
                    where: {
                        MemeId
                    },
                    order: [['createdAt', 'DESC']]
                })
            })
            .then((detail) => {
                // res.send(detail)
                res.render('meme', { meme, detail, timeSince, user, query })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static addComment(req, res) {
        const MemeId = +req.params.id
        const { comment } = req.body
        const { id } = req.session.user

        MemeDetail.create({ comment, MemeId, UserId: id })
            .then(() => {
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err) => {
                res.redirect(`/meme/${MemeId}`)
            })
    }

    static addMemePage(req, res) {
        let error = req.query.error

        Tag.findAll()
            .then((tag) => {
                res.render('add-meme', { tag, error })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static addMeme(req, res) {
        const { id } = req.session.user
        const { title, imageURL, TagId } = req.body

        Meme.create({
            title,
            imageURL,
            TagId,
            UserId: id
            })
            .then(() => {
                res.redirect('/')
            })
            .catch((err) => {
                if(err.name === "SequelizeValidationError"){
                    let error = err.errors.map(el=>el.message.split('-'))
                    res.redirect(`/meme/add?error=${error}`)
                } else {
                    res.send(err)
                }
            })
    }

    static signUpForm(req, res) {
        res.render('signUp') //cek kalo ada errornya tampilin error di halaman
    }

    static signUpPost(req, res) {
        const { userName, password, email, firstName, lastName, dateOfBirth } = req.body
        const user = {
            userName,
            password,
            email
        }
        const userProfile = {
            firstName,
            lastName,
            dateOfBirth
        }
        let errorMsg
        User.create(user)
            .then((user) => {
                userProfile.UserId = user.id
                return UserProfile.create(userProfile)
            })
            .then(data => {
                // res.send(data) //notify success create user redirect ke sign in page via req query
                res.redirect('/signIn')
            })
            //2 catch untuk nampung error dari kedua table
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    errorMsg = err.errors.map(el => {
                        return el.message
                    })
                    return UserProfile.create(userProfile)
                } else {
                    res.send(err)
                }
            })
            .catch(err => {
                err.errors.forEach(el => {
                    return errorMsg.push(el.message)
                })
                res.send(errorMsg) //redirect ke halaman sign in + errornya via req query 
            })
    }


    static signInForm(req, res) {
        res.render('signIn') //cek kalo ada errornya tampilin error di halaman
    }

    static signInPost(req, res) {
        const { userName, password } = req.body
        let error
        User.findOne({ where: { userName } })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {
                        //set session ketika user login
                        const { id, userName, isAdmin } = user
                        req.session.user = {
                            id,
                            userName,
                            isAdmin
                        }

                        res.redirect('/')
                    } else {
                        error = 'username/password ga oke bos'
                        res.send(error) //redirect ke halaman login lagi kirim error via query
                    }
                } else {
                    error = 'kamu kayanya belum daftar bro ga ada username kamu nih di db'
                    res.send(error)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static signOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/signIn')
            }
        })
    }

    static delete(req, res){
        const MemeId = req.params.memeId
        const commentId = req.params.commentId

        MemeDetail.destroy({
            where: {
                id: commentId
            }
            })
            .then(()=>{
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err)=>{
                res.send(err)
            })
    }

    static editComment(req, res){
        const MemeId = req.params.memeId
        const commentId = req.params.commentId
        const { comment } = req.body

        MemeDetail.update({
            comment
            },{
            where: {
                id: commentId
            }
            })
            .then(()=>{
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err)=>{
                res.redirect(`/meme/${MemeId}`)
            })
    }
}

module.exports = Controller
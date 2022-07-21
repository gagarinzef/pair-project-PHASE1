const { Meme, MemeDetail, User, UserProfile, Tag } = require('../models')
const bcrypt = require('bcryptjs')
const { timeSince } = require('../helper/helper')
const { Op } = require("sequelize")

class Controller {
    static home(req, res) {
        const user = req.session.user
        const filter = req.query.filter
        const search = req.query.search

        let optUser = {}
        if (filter){
            optUser = {
                name: filter
            }
        }

        let optMeme = {}
        if(search){
            optMeme = {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }

        let meme;
        let tag;
        Meme.findAll({
            order: [['createdAt', 'DESC']],
            include: [User, {
                model: Tag,
                where: optUser
            }],
            where: optMeme
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
        const {user} = req.session
        Tag.findAll()
            .then((tag) => {
                res.render('add-meme', { tag, error, user })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static addMeme(req, res) {
        const { title, TagId } = req.body
        const { id } = req.session.user
        const { filename } = req.file

        Meme.create({
            title,
            imageURL: filename,
            TagId,
            UserId: id
            })
            .then(() => {
                res.redirect('/')
            })
            .catch((err) => {
                if (err.name === "SequelizeValidationError") {
                    let error = err.errors.map(el => el.message.split('-'))
                    res.redirect(`/meme/add?error=${error}`)
                } else {
                    res.send(err)
                }
            })
    }

    static deleteMeme(req,res){
       const memeId = +req.params.memeId

       MemeDetail.destroy({
            where: {
                MemeId: memeId
            }
       })
       .then(()=>{
            return Meme.destroy({
                where: {
                    id: memeId
                }
            })
       })
       .then(()=>{
            res.redirect('/')
       })
       .catch((err)=>{
            res.send(err)
       })
    }

    static deleteComment(req, res) {
        const MemeId = req.params.memeId
        const commentId = req.params.commentId

        MemeDetail.destroy({
            where: {
                id: commentId
            }
            })
            .then(() => {
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static editComment(req, res) {
        const MemeId = req.params.memeId
        const commentId = req.params.commentId
        const { comment } = req.body

        MemeDetail.update({
            comment
            }, {
            where: {
                id: commentId
            }
            })
            .then(() => {
                res.redirect(`/meme/${MemeId}`)
            })
            .catch((err) => {
                res.redirect(`/meme/${MemeId}`)
            })
    }



    static signUpForm(req, res) {
        const { errors } = req.query
        res.render('signUp', { errors })
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
            .then(() => {
                res.redirect('/signIn')
            })
            //2 catch untuk nampung error dari kedua table
            .catch(err => {
                if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
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
                    if (el.path !== 'UserId') {
                        return errorMsg.push(el.message)
                    }
                })
                res.redirect(`/signUp?errors=${errorMsg}`)
            })
    }


    static signInForm(req, res) {
        const { errors } = req.query
        res.render('signIn', { errors })
    }

    static signInPost(req, res) {
        const { userName, password } = req.body
        let errors
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
                        errors = 'Invalid username/password'
                        res.redirect(`/signIn?errors=${errors}`)
                    }
                } else {
                    errors = 'There is no username registered'
                    res.redirect(`/signIn?errors=${errors}`)
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

    static userProfile(req, res) {
        const { success, errors } = req.query
        const { id } = req.params
        let user
        User.findByPk(id)
            .then(userData => {
                user = userData
                return UserProfile.findOne({ where: { UserId: id } })
            })
            .then(userProfile => {
                res.render('userProfile', { user, userProfile, success, errors })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static userProfilePost(req, res) {
        const { id } = req.params
        const { firstName, lastName, dateOfBirth, bio } = req.body
        const userProfile = {
            firstName,
            lastName,
            dateOfBirth,
            bio
        }
        UserProfile.update(userProfile, {
            where: {
                UserId: id
            }
            })
            .then(() => {
                res.redirect(`/user/${id}/profile?success=true`)
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map(el => {
                        return el.message
                    })
                    res.redirect(`/user/${id}/profile?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static userAccount(req, res) {
        const { success, errors } = req.query
        const { id } = req.params
        User.findByPk(id)
            .then(user => {
                res.render('userAccount', { user, success, errors })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static userAccountPost(req, res) {
        const { email, password } = req.body
        const { id } = req.params
        const user = {
            email,
            password
        }
        User.update(user, {
            where: {
                id
            },
            individualHooks: true
            })
            .then(() => {
                res.redirect(`/user/${id}/account?success=true`)
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    const errors = err.errors.map(el => {
                        return el.message
                    })
                    res.redirect(`/user/${id}/account?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static tag(req,res){
        const {user} = req.session
        Tag.findAll()
        .then(tags=>{
            res.render('tag',{tags, user})
        })
    }

    static tagAddForm(req,res){
        const {success,errors} = req.query
        const {user} = req.session
        res.render('tagAdd', {user, success, errors})
    }

    static tagAddPost(req,res){
        const {tag} = req.body
        const tagData = {
            name: tag
        }
        Tag.create(tagData)
        .then(()=>{
            res.redirect(`/tag/add?success=true`)
        })
        .catch(err=>{
            if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                const errors = err.errors.map(el => {
                    return el.message
                })
                res.redirect(`/tag/add?errors=${errors}`)
            }else{
                res.send(err)
            }
        })
    }


    static tagDelete(req,res){
        const tagId = +req.params.tagId
        Tag.destroy({
            where:{
                id: tagId
            }
        })
        .then(()=>{
            res.redirect('/tag')
        })
        .catch(err=>{
            res.send(err)
        })
    }



    
}

module.exports = Controller
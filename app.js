require ('babel-register')
const mysql = require("mysql")
const {success, error} = require('functions')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const config = require('./config')



//--------------------------------------------Connecting with mysql db-----------------------------------------------------
const db = mysql.createConnection({
    host:'localhost',
    database: 'nodejs',
    user:'root',
    password: ""
})

db.connect((err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log('Connected.')
        const app = express()

        //--------------------------------------------Router-----------------------------------------------------
        let MembersRouter = express.Router()


        //---------------------------------Middleware-------------------------------------------------------
        app.use(morgan('dev'))

        app.use(express.json()) // for parsing application/json
        app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


        //-----------------------------------GET/PUT/DELETE BY ID--------------------------------------------------------------
        MembersRouter.route('/:id')

            //Récupère un membre avec son ID
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                    if(err){
                        res.json(error(err.message))
                    }else{
                        if(result[0] != undefined){
                            res.json(success(result[0]))
                        }else{
                            res.json(error('Wrong id'))
                        }
                    }
                })

            })

            //Update un membre avec son ID
            .put((req, res) => {

                if (req.body.name) {

                    db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => {
                        if (err) {
                            res.json(error(err.message))
                        } else {

                            if (result[0] != undefined) {

                                db.query('SELECT * FROM members WHERE name = ? AND id = ?', [req.body.name, req.params.id], (err, result) => {
                                    if (err) {
                                        res.json(error(err.message))
                                    } else {
                                        console.log(result[0])
                                        if (result[0] != undefined) {
                                            res.json(error('same name'))
                                        } else {

                                            db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => {
                                                if (err) {
                                                    res.json(error(err.message))
                                                } else {
                                                    res.json(success(true))
                                                }
                                            })

                                        }

                                    }
                                })

                            } else {
                                res.json(error('Wrong id'))
                            }

                        }
                    })

                } else {
                    res.json(error('no name value'))
                }

            })

            //Supprime un membre avec son ID
            .delete((req, res) => {

                let index = getIndex(req.params.id);

                if(typeof(index) == 'string'){
                    res.json(error(index))
                }else{
                    members.splice(index, 1)
                    res.json(success(members))
                }

            })

            

        //-----------------------------------GET/POST BY MEMBERS--------------------------------------------------------------
        MembersRouter.route('/')

            //Récupère membre
            .get((req, res) => {
                if(req.query.max != undefined && req.query.max > 0){

                    db.query('SELECT * FROM members LIMIT 0, ?', [req.query.max], (err, result) => {
                        if(err){
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })

                }else if(req.query.max != undefined){
                    res.json(error('Wrong max value'))
                }else{

                    db.query('SELECT * FROM members', (err, result) => {
                        if(err){
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })
                }
            })

            //Ajoute membre
            .post((req, res) => {
                if(req.body.name) {

                    db.query('SELECT * FROM members WHERE name = ?', [req.body.name] ,(err, result) => {
                        if(err){
                            res.json(error(err.message))
                        }else{
                            if(result[0] != undefined){
                                res.json(error('name already taken'))
                            }else{
                                db.query('INSERT INTO members(name) VALUES(?)', [req.body.name], (err, result) => {
                                    if(err){
                                        res.json(error(err.message))
                                    }else{
                                        db.query('SELECT * FROM members WHERE name = ?',[req.body.name], (err, result) => {
                                            if(err){
                                                res.json(error(err.message))
                                            }else{
                                                res.json(success({
                                                    id: result[0].id,
                                                    name: result[0].name
                                                }))
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
        

                }else{
                    res.json(error('no name value'))
                }
            })


        //--------------------------------------Middleware-----------------------------------------------------------
        app.use('/api/v1/members', MembersRouter)


        //--------------------------------------Listen-----------------------------------------------------------
        app.listen(config.port, () => console.log('Started on port '+config.port))


        
    }
})




//--------------------------------------Functions-----------------------------------------------------------
function getIndex(id) {
    for (let i=0; i<members.length; i++){
        if(members[i].id == id)
            return i
    }
    return 'wrong id'

}

function createId() {
    return members[members.length-1].id + 1
}
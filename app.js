require ('babel-register')
const {success, error} = require('functions')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const app = express()
const config = require('./config')


//--------------------------------------------Members-----------------------------------------------------
const members = [
    {
        id: 1,
        name: 'Andy',
    },
    {
        id: 2,
        name: 'Lionel',
    },
    {
        id: 3,
        name: 'Jamal',
    }
]

//--------------------------------------------Router-----------------------------------------------------
let MembersRouter = express.Router()


//---------------------------------Middleware-------------------------------------------------------
app.use(morgan('dev'))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(config.rootAPI+'members', MembersRouter)



//-----------------------------------GET/PUT/DELETE BY ID--------------------------------------------------------------
MembersRouter.route('/:id')


    //Récupère un membre avec son ID
    .get((req, res) => {

        let index = getIndex(req.params.id);

        if(typeof(index) == 'string'){
            res.json(error(index))
        }else{
            res.json(success(members[index]))
        }
    })

    //Update un membre avec son ID
    .put((req, res) => {

        let index = getIndex(req.params.id);

        if(typeof(index) == 'string'){
            res.json(error(index))
        }else{

            let same = false;

            for (let i=0; i<members.length; i++){
                if(req.body.name == members[i].name && req.params.id != members[i].id){
                    same = true
                    break
                }
            }
            if (same) {
                res.json(error('same name'))
            }else{
                members[index].name = req.body.name;
                res.json(success(true))  
            }
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
            res.json(success(members.slice(0, req.query.max)))
        }else if(req.query.max != undefined){
            res.json(error('Wrong max value'))
        }else{
            res.json(success(members))
        }
    })

    //Ajoute membre
    .post((req, res) => {
        if(req.body.name) {

            let sameName = false

            for(let i=0; i < members.length; i++) {
                if(members[i].name == req.body.name){
                    sameName = true
                    break
                }
            }

            if(sameName){
                res.json(error('Name already taken'))
            }else{

                let member = {
                    id: createId(),
                    name: req.body.name
                }
        
                members.push(member)
        
                res.json(success(member))
            }        

        }else{
            res.json(error('no name value'))
        }
    })


//--------------------------------------Middleware-----------------------------------------------------------
//app.use('/api/v1/members', MembersRouter)


//--------------------------------------Listen-----------------------------------------------------------
app.listen(config.port, () => console.log('Started on port '+config.port))



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
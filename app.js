require ('babel-register')
const {success, error} = require('functions')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const app = express()


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

//---------------------------------middleware-------------------------------------------------------
app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded





//-----------------------------------GET BY ID--------------------------------------------------------------
app.get('/api/v1/members/:id', (req, res) => {

    let index = getIndex(req.params.id);

    if(typeof(index) == 'string'){
        res.json(error(index))
    }else{
        res.json(success(members[index]))
    }
})

//--------------------------------------PUT-----------------------------------------------------------
app.put('/api/v1/members/:id', (req, res) => {

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


//-----------------------------------GET BY MEMBERS--------------------------------------------------------------
app.get('/api/v1/members', (req, res) => {
    if(req.query.max != undefined && req.query.max > 0){
        res.json(success(members.slice(0, req.query.max)))
    }else if(req.query.max != undefined){
        res.json(error('Wrong max value'))
    }else{
        res.json(success(members))
    }
})




//--------------------------------------POST-----------------------------------------------------------
app.post('/api/v1/members', (req, res) => {
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
                id: members.length+1,
                name: req.body.name
            }
    
            members.push(member)
    
            res.json(success(member))
        }        

    }else{
        res.json(error('no name value'))
    }
  })




//--------------------------------------Listen-----------------------------------------------------------
app.listen(8080, () => console.log('Started on port 8080.'))


function getIndex(id) {
    for (let i=0; i<members.length; i++){
        if(members[i].id == id)
            return i
    }
    return 'wrong id'

}
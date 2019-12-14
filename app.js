require ('babel-register')
const func = require('functions')
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





//-----------------------------------GET--------------------------------------------------------------
app.get('/api/v1/members/:id', (req, res) => {
    res.json(func.success(members[(req.params.id) - 1].name))
})

app.get('/api/v1/members', (req, res) => {
    if(req.query.max != undefined && req.query.max > 0){
        res.json(func.success(members.slice(0, req.query.max)))
    }else if(req.query.max != undefined){
        res.json(func.error('Wrong max value'))
    }else{
        res.json(func.success(members))
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
            res.json(func.error('Name already taken'))
        }else{

            let member = {
                id: members.length+1,
                name: req.body.name
            }
    
            members.push(member)
    
            res.json(func.success(member))
        }        

    }else{
        res.json(func.error('no name value'))
    }
  })




//--------------------------------------Listen-----------------------------------------------------------
app.listen(8080, () => console.log('Started on port 8080.'))

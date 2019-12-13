require ('babel-register')
const express = require('express')
const morgan = require('morgan')
const app = express()

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

app.use(morgan('dev'))

app.get('/api/v1/members/:id', (req, res) => {
    res.send(members[(req.params.id) - 1])
})

app.listen(8080, () => console.log('Started on port 8080.'))
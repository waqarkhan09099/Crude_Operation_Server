import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
const port = process.env.PORT || 3000

mongoose.connect('mongodb+srv://Waqar-Khan123:waqarkhan12345@cluster0.lygb2.mongodb.net/NewDataBase?retryWrites=true&w=majority');

const User = mongoose.model('User', {
    "name": String,
    "email": String,
    "address": String,
    "password": String,

})

app.use(cors());

app.use(express.json())

app.use('/', (req, res, next) => {
    console.log("came Request from server", new Date())
    console.log(req.body)
    next()
})

app.get('/', (req, res) => {
    res.send("hello Newly Crude Operation")
})

app.get('/api/users', (req, res) => {
    User.find({}, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            res.status(500).send("Something Error")
        }
    })
})

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.findOne({ id: id }, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            res.status(404).send("Not Found")
        }
    })
})

app.post('/api/user', (req, res) => {
    console.log("We Are posting")
    if (!req.body.name || !req.body.email || !req.body.address || !req.body.password) {
        res.status(400).send("invalid Data")
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: req.body.password,
        })
        newUser.save().then((doc) => {
            console.log("User Created Successfully")
            res.send(doc)
        }).catch(err => { console.log(err) })
        res.send("User created")
    }
})

app.put('/api/user/:id', (req, res) => {
    const id = req.params.id
    const updateUser = {}
    if (req.body.email === "" || req.body.email) {
        updateUser.email = req.body.email
    }
    if (req.body.name === "" || req.body.name) {
        updateUser.name = req.body.name
    }
    if (req.body.address === "" || req.body.address) {
        updateUser.address = req.body.address
    }

    User.findByIdAndUpdate(id, updateUser, { new: true }, (err, doc) => {
        if (!err) {
            res.send(doc)            
            
        } else {
            res.status(500).send("Error Happened")
        }
    })

})

app.delete('/api/user/:id', (req, res) => {
    const id = req.params.id
    User.findByIdAndRemove(id, (err, doc) => {
        if (!err)  {
            console.log('User Successfully Deleted')
            res.send(doc)
        } else {
            res.status(404).send("User id not found")
        }
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
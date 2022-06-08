require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;

MongoClient.connect(process.env.MONGO_URL)
.then(client => {

    db = client.db('smash');
    fighterCollection = db.collection('fighters');
    console.log('Connected to Database');
    app.set('view engine', "ejs");
    app.set('views', __dirname + '/views');
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cors());

    app.get('/', (req,res)=>{
        res.render("index.ejs")
    })
    app.get('/api/', (req,res)=>{
        fighterCollection.find().toArray().then(result => {
            res.send(result)
        }).catch(err => console.error(err));
    })
    app.get('/api/:fighter', (req,res)=>{    
        const fighterName = req.params.fighter;
        const name = fighterName.split(' ').map(e =>  e[0].toUpperCase() + e.substring(1).toLowerCase()).join(' ');
        fighterCollection.find({name: name}).toArray().then(result => {
            const fighter = result[0];
           res.send(fighter)
        }).catch(err => console.error(err));
    })
    app.get('/:fighter', (req,res)=>{
        const fighterName = req.params.fighter;
        const name = fighterName.split(' ').map(e =>  e[0].toUpperCase() + e.substring(1).toLowerCase()).join(' ');
        fighterCollection.find({name: name}).toArray().then(result => {
            const fighter = result[0];
            if(fighter){
                res.render("fighter.ejs", {
                    obj: fighter,
                    name: fighter.name,
                    game: fighter.game,
                    jumpCount: fighter.jumpCount,
                    weight: fighter.weight,
                    img: fighter.img
                })
            }
           else{
               res.send("Not a Fighter/ Not Yet Added")
           }
        }).catch(err => console.error(err));
    })
    
    app.listen(PORT, ()=> console.log(`Server Started on Port: ${PORT}`));
})
.catch(err => console.error(err));
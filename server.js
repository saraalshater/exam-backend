'use strict';
const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());


const PORT = 3005;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/flowersdb', { useNewUrlParser: true, useUnifiedTopology: true });


const flowersSchema = new mongoose.Schema({
    name: String,
    imgUrl: String,
    about: String
});

const userSchema = new mongoose.Schema({
    email: String,
    flowers: [flowersSchema]
});

const User = mongoose.model('User', userSchema);



function seedCollections() {

    let sara = new User({
        email: 'gleave.alshater@gmail.com',
        flowers: [{
            name: "Azalea",
            imgUrl: "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
            about: "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5."
        }]
    })


    let roaa = new User({
        email: "roaa.abualeeqa@gmail.com",
        flowers: [{
            name: "Azalea",
            imgUrl: "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
            about: "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5."
        }]
    })


    sara.save();
    roaa.save();

}

// seedCollections();




class Flowers {
    constructor(item) {
        this.name = item.name;
        this.imgUrl = item.photo;
        this.about = item.instructions;
    }
}


//http://localhost:3005/
server.get('/', (req, res) => {
    res.send('root route is working')
});

///////////////////////////////////////////////////////
//http://localhost:3005/flowers
server.get('/flowers', (req, res) => {
    const url = 'https://flowers-api-13.herokuapp.com/getFlowers';
    axios
        .get(url)
        .then(result => {
            let flowerArr = result.data.flowerslist.map(item => {
                return new Flowers(item);
            })
            console.log(flowerArr);
            res.send(flowerArr);
        })
        .catch(err => { res.send(err) });
})
///////////////////////////////////////////////////////////
//http://localhost:3005/addFav
server.post('/addFav', (req, res) => {
    let email = req.query.email;
    const { name, imgUrl, about } = req.body;

    User.find({ email: email }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            data[0].flowers.push({
                name: name,
                imgUrl: imgUrl,
                about: about
            })
            data[0].save();
            res.send(data[0].drinks)
        }
    })
})
////////////////////////////////////////////////
//http://localhost:3005/favCard
server.get('/favCard', (req, res) => {
    User.find({}, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data[0].flowers)
        }
    })
})
/////////////////////////////////////////
//http://localhost:3005/deleteFav/:id
server.delete('/deleteFav/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    User.deleteOne({ _id : id }, (error,data)=>{

    })
    User.find({}, (error, data)=>{
        res.send(data)
    })
   
})
//////////////////////////////////
server.put('/updatedata/:element_id', (req,res) => {
    const flowersId = req.params.element._id;
    const { name, imgUrl, about } = req.body;
    User.findByIdAndUpdate(
        { _id: id},
        {
            name: name,
            imgUrl: imgUrl,
            about: about
        },
        {new : true},
        (err,data)=>{
            res.send(data)
        }
    )
})




server.get('*', (req, res) => {
    res.send('page not found')
});

server.listen(PORT, () => console.log(`i am listening on ${PORT}`));
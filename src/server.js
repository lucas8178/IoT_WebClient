const express = require('express');
const session = require('express-session');
const crypto = require('node:crypto');
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');
const urlparser = bodyparser.urlencoded({extended: false});
const Users = require('./users.js');
const Plants = require('./plants.js');
const Sensors = require('./sensors.js');

const app = express();

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave:false,
    saveUninitialized: false,
}));


//this function verifies if the user is logged
const isAuthenticated = (req, res, next) =>
{
    if(req.session.user)
    {
        next();
    }
    else
        res.redirect('/login');
}

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

//this route redirects to the main page
app.get('/home', (req, res) => {
    res.redirect('/');
});

//this route is the route to the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

//this route get the images for the carrousel
app.get('/postImageNames', (req, res) => {
    fs.readdir(path.join(__dirname, '../public/img/index'), (err, files) => {
        if(err) {
            res.json({state: "Error", error: err});
        }

        res.json(files);
    });

});

//this route goes to the register user page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/register.html'));
});

//this route recives the data from the register page and executes the user creation
app.post('/createUser', async (req, res) => {
    let data = req.body;
    let newUser = new Users();
    let result = await newUser.createUser(data.name, data.email, data.pword, data.cpword);

    res.json(result);
});

//this route goes to the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

//this route executes the singin action using the login page data
app.post('/signIn', urlparser, async (req, res) => {
    try
    {
        let data = req.body;
        let myUser = new Users();
        myUser.name = data.name;
        let result = await myUser.LogUser(data.pword);

        if(result.state)
        {
            req.session.user = result.data;
        }
        res.json(result);

    } catch(error)
    {
        console.log(error.message);
    }
});

//Need authentication

//this route shows the menu of options
app.get('/menu', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/mainMenu.html'));
});

//this route goes to the plant Register page
app.get('/create', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/plantCad.html'));
});

//this route executes the registration of the plant using the plantcad data
app.post('/createPlant', isAuthenticated, async (req, res) => {
    let data = req.body;
    let newPlant = new Plants();
    let result = await newPlant.createPlant(data.name, data.image, data.description, req.session.user.id);

    res.json(result);
});

app.post('/editPlant', isAuthenticated, async (req, res) => {
    let data = req.body;
    let newPlant = new Plants();
    let result = await newPlant.editPlants(data.name, data.image, data.description, data.plantId, req.session.user.id);

    res.json(result);
});

//this route is used to get the user data when its needed
app.get('/getUserData', isAuthenticated, async (req, res) => {
    res.json(req.session.user);
});

//this route is used to get the LOCALIP when needed
app.get('/getLocalIp', isAuthenticated, async (req, res) => {
    let myIp = process.env.LOCALIP;
    res.json({ip: myIp});
});

//this route goes to the form to register the values for comparate with the sensors in the IoT garden
app.get('/configure', isAuthenticated, async (req, res) => {
	res.sendFile(path.join(__dirname, '../public/html/statsCad.html'));
});

//this route is used to get the data of the plants of this user when needed
app.get('/getPlantsData', isAuthenticated, async (req, res) => {
	let plant = new Plants(null, '', '' , '',  false, req.session.user.id);
	let data = await plant.findUserPlants();
    console.log(data.state);
	res.json(data);
});

//this route saves the sensors data in the database
app.post('/saveSensorsData', isAuthenticated, async (req, res) => {
	let data = req.body;
	let sensors = new Sensors(data.plantId, data.moistureMin, data.moistureMax, data.minExternal, data.maxExternal, data.minInternal, data.maxInternal);
	res.json(await sensors.saveSensorsConfigs());
});

app.post('/deletePlants', isAuthenticated, async (req, res) => {
    let data = req.body;
    let newPlant = new Plants();
    let ids = req.body.map(Number);
    res.json(await newPlant.deletePlants(ids));
});

app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});

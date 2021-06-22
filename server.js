const utils = require('./SERVER/utils.js');

const path = require('path');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/db', (req, res) => {
	//console.log('Got body:', req.body);
	utils.toYamlFile(req.body.obj,req.body.path); 
	res.send('POST request to the homepage');
});


server.listen(3000, () => console.log('listening on *:3000'));

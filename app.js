const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');

const io = require('socket.io')(http);
const methods = require('./app/methods');
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const files = fs.readdirSync(process.env.DB);
    res.render('index', {files});
});

methods(io);

http.listen(1998, function () {
    console.log('listening on *:3000');
});
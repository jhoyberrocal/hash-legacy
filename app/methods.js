const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const decrypto = require('./decrypto');
const crypto = require('./crypto');
const folders = require('./folders');

const adapter = new FileSync('./public/db.json');
const db = low(adapter);

module.exports = io => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        const files = fs.readdirSync('./public/data');
        const fil = fs.readdirSync('./db');

        socket.emit('db', fil);
        socket.emit('dist', files);
        socket.on('desc', data => decrypto(socket, data));
        socket.on('enc', data => crypto(socket, data));
        folders(socket, db);
    });
};
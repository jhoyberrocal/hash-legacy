const pr = require('progress-stream');
const fs = require('fs');
const {Readable} = require('stream');
const crypto = require('crypto');
const {newExt} = require('./ext');

const files = {},
    struct = {
        name: null,
        type: null,
        size: 0,
        data: [],
        slice: 0,
    };

const cipher = async (socket, data) => {
    const key = crypto.scryptSync(data.password, 'salt', 24);
    const iv = Buffer.alloc(parseInt('16'), 0);

    const re = /(?:\.([^.]+))?$/;
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    const ext = newExt(re.exec(data.name)[1]);
    const id = new Date().getTime();
    const output = fs.createWriteStream(`./db/${id}-${ext}.enc`);

    const str = pr({
        length: data.size,
        time: 100 /* ms */
    });

    str.on('progress', (progress) => {
        socket.emit('progress', progress.percentage);
    });

    await fs.createReadStream(`./tmp/${data.name}`)
        .pipe(str)
        .pipe(cipher)
        .pipe(output);

    const fil = fs.readdirSync('./db');
    socket.emit('db', fil);
    setTimeout(() => {
        fs.unlinkSync(`./tmp/${data.name}`);
        socket.emit('finish', 'finish');
    }, 1000);
};

const crypt = (socket, data) => {
    if (!files[data.name]) {
        files[data.name] = Object.assign({}, struct, data);
        files[data.name].data = [];
    }

    const buffer = Buffer.from(new Uint8Array(data.data));
    files[data.name].data.push(buffer);
    files[data.name].slice++;

    if (files[data.name].slice * 100000 >= files[data.name].size) {
        const fileBuffer = Buffer.concat(files[data.name].data);
        fs.writeFileSync( './tmp/' + data.name, fileBuffer );
        delete files[data.name];
        cipher(socket, data);

    } else {
        socket.emit('new-slice', {
            currentSlice: files[data.name].slice
        });
    }
};

module.exports = crypt;
const pr = require('progress-stream');
const crypto = require('crypto');
const fs = require('fs');
const {seeExt} = require('./ext');

const decrypto = (socket, data) => {
    const re = /(?:([^-]+))?$/;

    const hasher = async ({inp, out, ext}) => {
        const key = crypto.scryptSync(data.password, 'salt', 24);
        const iv = Buffer.alloc(parseInt('16'), 0);
        const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
        const output = fs.createWriteStream(`${out}.${ext}`);
        const stat = fs.statSync(inp);
        const str = pr({
            length: stat.size,
            time: 100 /* ms */
        });

        str.on('progress', (progress) => {
            socket.emit('progress', progress.percentage);
        });

        await fs.createReadStream(inp)
            .pipe(str)
            .pipe(decipher)
            .pipe(output);

        const files = fs.readdirSync('./public/data');
        socket.emit('dist', files);
    };

    if (data.type === 1) {
        const id = data.name.slice(0, -4);
        const file = {
            inp: `./db/${id}.enc`,
            out: `./public/data/${id}`,
            ext: seeExt(re.exec(data.name)[1])
        };
        hasher(file);
    } else if (data.type === 2) {
        const files = fs.readdirSync('./db');
        files.forEach((file) => {
            const id = file.slice(0, -4);
            const noExt = id.slice(0, -7);
            const fileD = {
                inp: `./db/${file}`,
                out: `./public/data/${noExt}`,
                ext: seeExt(re.exec(id)[1])
            };
            hasher(fileD);
        });
    }
};

module.exports = decrypto;
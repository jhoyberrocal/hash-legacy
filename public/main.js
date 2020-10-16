document.addEventListener('DOMContentLoaded', function () {
    const socket = io();
    new Vue({
        el: '#app',
        data: {
            password: '',
            lib: [],
            dist: [],
            progress: 0,
            file: {
                ext: null,
                name: null,
                open: false,
                idx: null
            },
            fileUp: null,
            fileReader: null,
            uploader: 0
        },
        methods: {
            handleFile(e) {
                this.fileUp = e.target.files[0];
                const slice = this.fileUp.slice(0, 100000);

                this.fileReader.readAsArrayBuffer(slice);
            },
            openFile(id, idx) {
                const re = /(?:\.([^.]+))?$/;
                const ext = re.exec(id)[1];
                this.file.open = true;
                this.file.name = id;
                this.file.ext = ext;
                this.file.idx = idx;
            },
            cleanFile() {
                this.file.name = null;
                this.file.ext = null;
            },
            closeFile() {
                this.cleanFile();
                this.file.open = false;
                this.file.idx = null;
            },
            changeFile(idx, dir) {
                const re = /(?:\.([^.]+))?$/;
                this.cleanFile();
                let nFile, key;
                if (dir === 1) {
                    if(idx === 0) {
                        nFile = this.dist[this.dist.length - 1];
                        key = this.dist.length - 1;
                    } else {
                        nFile = this.dist[idx - 1];
                        key = idx - 1;
                    }

                } else {
                    if (idx === this.dist.length - 1) {
                        nFile = this.dist[0];
                        key = 0;
                    } else {
                        nFile = this.dist[idx + 1];
                        key = idx + 1;
                    }
                }
                this.file.ext = re.exec(nFile)[1];
                this.file.name = nFile;
                this.file.idx = key;
            },
            desc(id, type) {
                socket.emit('desc', {name: id, password: this.password, type});
            }
        },
        mounted() {
            const V = this;
            socket.on('db', files => V.lib = files);
            socket.on('dist', files => V.dist = files);
            socket.on('progress', prg => V.progress = prg);
            socket.on('finish', () => {
               V.uploader = 2;
               setTimeout(() => {
                   V.uploader = 0
               }, 2000);
            });

            V.fileReader = new FileReader();
            V.fileReader.onload = (evt) => {
                V.uploader = 1;
                socket.emit('enc', {
                    name: V.fileUp.name,
                    size: V.fileUp.size,
                    type: V.fileUp.type,
                    data: evt.target.result,
                    password: V.password,
                    slice: 0
                });
            };

            socket.on('new-slice', data => {
                const place = data.currentSlice * 100000,
                    slice = V.fileUp.slice(place, place + Math.min(100000, V.fileUp.size - place));

                V.fileReader.readAsArrayBuffer(slice);
            });
        }
    });

});

const shortid = require('shortid');

module.exports = (socket, db) => {
    socket.on('get-collections', () => {
        const folders = db.get('folders').value();
        socket.emit('collections', folders);
    });
    socket.on('get-documents', data => {
        const folder = db.get('folders').find({id: data.idF}).value();
        const files = db.get('files').filter({id_folder: data.idF}).value();
        socket.emit('documents', {
          folder,
          files
        });
    });
    socket.on('new-folder', name => {
      const folders = db.get('folders').push({
        id: shortid.generate(),
        name
      }).write();

      socket.emit('collections', folders);
    });
    socket.on('edit-folder', file => {
      db.get('folders').find({id: file.id}).set('name', file.name).write();
      const folders = db.get('folders').value();
      socket.emit('collections', folders);
    })
};

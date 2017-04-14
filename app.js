const http = require('http');
const express = require('express');
const app = express();
const io = require('socket.io')
const server = http.createServer(app);
const socket = io(server);

const PORT = process.env.PORT || 8080;

app.use( express.static( __dirname + "/dist/") );

let batchQueue = [{name: "ITM-BB01", DPCIS: 5, eaches: 17, owner: "Juan Meza"}];
const maxBatches = 20;
const maxBatchAge = 2000;

socket.on('connection', (client) => {
  client.emit('connected', batchQueue);

  client.on('newBatch', (batchOptions) => {
    batchQueue.push(batchOptions);
    client.emit('newBatch', batchOptions);
    client.broadcast.emit('newBatch', batchOptions);
  });

  client.on('batchComplete', (batchOptions) => {
    client.emit('batchComplete', batchOptions);
    client.broadcast.emit('batchComplete', batchOptions);
  });
  client.on('batchCancelled', (batchOptions) => {
    client.emit('batchCancelled', batchOptions);
    client.broadcast.emit('batchCancelled', batchOptions);
  });

});


server.listen(PORT);

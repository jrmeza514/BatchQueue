const http = require('http');
const express = require('express');
const app = express();
const io = require('socket.io')
const server = http.createServer(app);
const socket = io(server);

const PORT = process.env.PORT || 8080;

app.use( express.static( __dirname + "/dist/") );

let batchQueue = [{
  name: "ITM-BB01-0",
  DPCIS: 20,
  eaches: 480,
  owner: "Juan Meza"
},
{
  name: "ITM-FURN-0",
  DPCIS: 3,
  eaches: 6,
  owner: "Juan Meza"
}];
const maxBatches = 20;
const maxBatchAge = 2000;

socket.on('connection', (client) => {
  client.emit('connected', batchQueue);

  client.on('newBatch', (batchOptions) => {
    batchQueue.push(new Batch(batchOptions));
    client.emit('batchReceived', batchOptions);
  });

  client.on('batchComplete', (batchOptions) => {

  });

});


server.listen(PORT);

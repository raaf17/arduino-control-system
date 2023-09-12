const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Server } = require('socket.io');
const express = require('express');
const port = 3000;

const app = express();
const io = new Server(app);

app.use(express.json());

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  console.log("connected...");
  socket.on('disconected', () => {
    console.log('disconnect');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

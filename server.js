const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const portServer = 3000;

const app = express();

const server = http.createServer(app);
const io = new Server(server);

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

app.listen(portServer, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Konektifitas serial arduino
const port = new SerialPort({
  path: "COM3",
  baudRate: 19200,
});

// Parsing data dari arduino
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n"}));

// Menangkap dat dari arduino
parser.on('data', (result) => {
  console.log("data dari arduino -> ", result);
  io.emit("data", { data: result });
});

app.post('/arduinoApi', (req, res) => {
  const data = req.body.data;
  port.write(data, (err) => {
    if (err) {
      console.log('error: ', error);
      res.status(500).json({ error: "write data error!"})
    }
    console.log("data terkirim -> ", data);
    res.end();
  });
});

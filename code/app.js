const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const clientCACert = 'certs/clientCA.crt';
const serverKey = 'certs/server.key';
const serverCert = 'certs/server.crt';
const { Server } = require("socket.io");
const io = Server(https.createServer({
  key: fs.readFileSync(serverKey),
  passphrase: KEY_PASSPHRASE,
  cert: fs.readFileSync(serverCert),
  ca: fs.readFileSync(clientCACert),
  requestCert: true
}).listen(WS_PORT, () => {
  console.log(`WebSocket Server listening on port${WS_PORT}`);
}));



const uiServer = http.createServer(app);

const uiIo = new Server(uiServer);
const port = process.env.PORT || 8080;
const uiport = process.env.UI_PORT || 8081;
var uisocket = "";
var connsocket = "";
io.on('connection', (socket) => {
    connsocket = socket;
    console.log('IO: a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('video', (data) => {
      if (uiIo.sockets.sockets != "") {
        uiIo.emit("video", data);
      }
    });
  });
server.listen(port, () => {
  console.log('Server listening on *:' + port);
});

uiIo.on('connection', (socket) => {
    uisocket = socket;
    console.log('uiIO: a user connected');
    if (connsocket != ""){
      socket.on("control", (control, act) => {
        console.log("emit control: " + control + " act: " + act)
        connsocket.emit("control", control, act);
      });
      socket.on("user_on", (status) => {
        connsocket.emit("user_on", status);
      });
    }
    socket.on('disconnect', () => {
      uisocket = "";
      console.log('user disconnected');
    });
  });
uiServer.listen(uiport, () => {
  console.log('UIServer listening on *:' + uiport);
});
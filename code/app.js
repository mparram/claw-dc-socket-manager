const express = require('express');
const app = express();
var env = require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const clientCACert = 'certs/clientCA.crt';
const serverKey = 'certs/server.key';
const serverCert = 'certs/server.crt';
const { Server } = require("socket.io");
const KEY_PASSPHRASE = process.env.KEY_PASSPHRASE || "";
const port = process.env.PORT || 8080;
const uiport = process.env.UI_PORT || 8081;
const io = new Server(https.createServer({
  key: fs.readFileSync(serverKey, 'utf-8'),
  passphrase: KEY_PASSPHRASE,
  cert: fs.readFileSync(serverCert, 'utf-8'),
  ca: [fs.readFileSync(clientCACert, 'utf-8')],
  requestCert: true
}).listen(port, () => {
  console.log(`WebSocket Server listening on port${port}`);
}));



const uiServer = http.createServer(app);

const uiIo = new Server(uiServer);

var uisocket = "";
var connsocket = "";
io.on('connection', (socket) => {
    connsocket = socket;
    console.log('IO: a user connected');
    connsocket.on('disconnect', () => {
      console.log('user disconnected');
    });
    connsocket.on('video', (data) => {
      if (uiIo.sockets.sockets != "") {
        uiIo.emit("video", data);
      }
    });
    connsocket.on('color', (data) => {
      console.log("color: " + data);
      uiIo.emit("color", data);
    });
    io.on('disconnect', () => {
      connsocket = "";
      console.log('device disconnected');
    }
    );
  });


uiIo.on('connection', (socket) => {
    uisocket = socket;
    console.log('uiIO: a user connected');
    if (connsocket != ""){
      socket.on("control", (control, act) => {
        console.log("emit control: " + control + " act: " + act)
        connsocket.emit("control", control, act);
      });
      uisocket.on("panic", () => {
        connsocket.emit("panic");
      });
      uisocket.on("user_on", (status) => {
        console.log("emit user_on: " + status);
        connsocket.emit("user_on", status);
      });
    }
    uisocket.on('disconnect', () => {
      uisocket = "";
      console.log('front disconnected');
    });
  });
uiServer.listen(uiport, () => {
  console.log('UIServer listening on *:' + uiport);
});
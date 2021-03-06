const express = require('express');
const webSocket = require('ws');
const SocketServer = webSocket.Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

//sends update when usercount changes
function sendUsercountUpdate() {
  const usercountNotification = {
    type: "usercountUpdate",
    usercount: wss.clients.size
  }
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(usercountNotification))
  });
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected', "numberOfUsers:", wss.clients.size);
  sendUsercountUpdate();

//handles what happens when a message is submitted; identifies message type and sends the appropriate message to the server
  ws.on('message', function incoming(data) {
    let newMessage = JSON.parse(data);
    newMessage.id = uuidv4();
    if (newMessage.type === "postMessage") {
      newMessage.type = "incomingMessage";
    } else if (newMessage.type === "postNotification") {
      newMessage.type = "incomingNotification";
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === webSocket.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    sendUsercountUpdate();
  });
});
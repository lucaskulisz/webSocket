const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = 5500;

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
     console.log('A new client Connected!');
    ws.on('message', function (e) {
        
        const rawMessage = Buffer.from(e).toString();
        try {
            const { sender, message } = JSON.parse(rawMessage);
            console.log('received: %s', rawMessage);

            for (const client of wss.clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender,
                        message
                    }));
                }
            }
        } catch (error) {
            // Handle parsing errors here
        }
    });

    ws.on('close', () => {
        // Handle WebSocket connection close
    });

    ws.send(JSON.stringify({
        sender: 'system',
        message: 'Connection established'
    }));
});

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Hello, this is the root route.");
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

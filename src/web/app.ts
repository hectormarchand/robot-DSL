import express from 'express';
import { WebSocketReceiver } from './websocket/websocket.js';

const app = express();
const port = 3000;
app.use(express.static('./public'));
app.listen(port, () => { console.log(`Server for RobotLanguage assets listening on http://localhost:${port}`)});

export const wsServer = new WebSocketReceiver();
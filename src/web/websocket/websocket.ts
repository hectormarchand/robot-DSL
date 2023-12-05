import { WebSocketServer } from "ws";
import { visitFile } from "../../cli/main.js";

export const SOCKET_URL = 'ws://localhost:3000';

export class WebSocketReceiver {
    private socket: WebSocketServer;

    constructor() {
        this.socket = new WebSocketServer({ port: 3003 });
        
        this.socket.on("connection", (ws) => {
            console.log("ws connected");

            ws.onerror = this.onSocketError;

            ws.onmessage = this.onMessageReceived;
        })
    }

    private onMessageReceived = (event: any) => {
        const message = JSON.parse(event.data);
        console.log("type :",message.type);
        
        switch (message.type) {
            case "code":
                const codeReceived = message.text;
                console.log(codeReceived);
                visitFile(codeReceived);
                break;
            default:
                break;
        }
    };

    private onSocketError = (errorEvent: any): void => {
        console.error('WebSocket error:', errorEvent);
        // Handle any errors that occur with the WebSocket connection
    };

    public closeConnection(): void {
        this.socket.close();
    }
}

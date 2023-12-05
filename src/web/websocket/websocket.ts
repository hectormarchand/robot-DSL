import { WebSocketServer } from "ws";
import { parseAndValidate } from "../../cli/main.js";
import { createAstFromString } from "./utils.js";
import { Model } from "../../language/visitor.js";
import { interpret } from "../../semantic/interpreter.js";

export const SOCKET_URL = 'ws://localhost:3000';

export class WebSocketReceiver {
    private socket: WebSocketServer;

    constructor() {
        this.socket = new WebSocketServer({ port: 3003 });
        
        this.socket.on("connection", (ws: any) => {
            console.log("ws connected");

            ws.onerror = this.onSocketError;

            ws.onmessage = this.onMessageReceived;
        })
    }

    private onMessageReceived = async (event: any): Promise<void> => {
        const message = JSON.parse(event.data);
        console.log("Message received type :",message.type);
        let codeReceived = "";
        
        switch (message.type) {
            case "code":
                codeReceived = message.text;
                console.log(codeReceived);
                const model: Model = await createAstFromString<Model>(codeReceived);
                interpret(model);
                break;
            case "parseAndValidate":
                console.log("parseAndValidate...");
                codeReceived = message.text;
                parseAndValidate(codeReceived);
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

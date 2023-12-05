import { Model } from "../../language/generated/ast.js";
import { interpret } from "../../semantic/interpreter.js";
import { createAstFromString } from "./utils.js";
import { Robot } from "../simulator/entities.js";
import { WebSocketServer } from "ws";

export const SOCKET_URL = 'ws://localhost:3000';

export class WebSocketReceiver {
    private socket: WebSocketServer;
    private currentWS: WebSocket | undefined;

    constructor() {
        this.socket = new WebSocketServer({ port: 3003 });
        this.currentWS = undefined;
        
        this.socket.on("connection", (ws: WebSocket) => {
            console.log("ws connected");
            this.currentWS = ws;

            ws.onerror = this.onSocketError;

            ws.onmessage = this.onMessageReceived;
        })
    }

    private onMessageReceived = async (event: any): Promise<void> => {
        const message = JSON.parse(event.data);
        console.log("type :", message.type);
        
        switch (message.type) {
            case "code":
                const codeReceived = message.text;
                console.log(codeReceived);
                const model: Model = await createAstFromString<Model>(codeReceived);
                interpret(model);
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

    public emitRobot(robot: Robot): void {
        if (!this.currentWS) {
            return ;
        }

        const msg = {
            pos_x: robot.pos.x,
            pos_y: robot.pos.y,
            angle: robot.rad * 180 / Math.PI, // radian to degree
        }

        console.log("send msg to client :", msg);

        this.currentWS?.send(JSON.stringify(msg));
    }
}

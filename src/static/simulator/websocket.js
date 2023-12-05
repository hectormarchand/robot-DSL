const SOCKET_URL = "ws://localhost:3003";

let webSocket = new WebSocket(SOCKET_URL);

webSocket.onopen = () => {
    console.info("web socket open");
};

export function sendCode(code) {
    console.log(typeof code);
    console.log(code);
    const msg = {
        type: "code",
        text: code,
        date: Date.now(),
    };

    webSocket.send(JSON.stringify(msg));
}

export function sendParseAndValidate(codeToParse) {
    const msg = {
        type: "parseAndValidate",
        text: codeToParse,
        date: Date.now(),
    };

    webSocket.send(JSON.stringify(msg));

}

webSocket.onmessage = (event) => {
    console.log("message recu : " + event.data);
}
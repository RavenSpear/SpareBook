export default class SocketUtil {
    host = "";
    webSocket = "";

    constructor(url) {
        this.host = "ws://" + url;
        this.webSocket = new WebSocket(this.host);
        this.webSocket.onopen = () => {
            console.log("Connection open");
        };
        this.webSocket.onclose = () => {
            console.log("Connection close");
        };
        this.webSocket.onerror = () => {
            console.log("Connection error");
        };
        // global.webSocket = webSocket;
    }

    sendToServer(msg) {
        this.webSocket.send(msg);
    }

    sendAndReceive(msg, recvMsgFunc) {
        this.sendToServer(msg);
        this.webSocket.onmessage = (e) => recvMsgFunc(e.data);
    }

    sendAndReceiveOnOpen(msg, recvMsgFunc) {
        this.webSocket.onopen = () => {
            this.sendToServer(msg);
        };
        this.webSocket.onmessage = (e) => recvMsgFunc(e.data);
    }
}

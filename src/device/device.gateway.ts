import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets";

@WebSocketGateway({
  cors: true,
  transports: ["websocket"],
})
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: any, ...args: any[]) {
    console.log("Device Connected");
  }
  handleDisconnect(client: any) {
    console.log("Device Disconnected");
  }
}

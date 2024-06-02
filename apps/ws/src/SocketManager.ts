import { randomUUID } from "crypto";
import { WebSocket } from "ws";

export type UserType = {
  id: string;
  name: string;
  socket: WebSocket;
};

export class User {
  public id: string;
  public name: string;
  public socket: WebSocket;

  constructor({ name, socket, id }: UserType) {
    this.name = name;
    this.socket = socket;
    this.id = id;
  }
}

export class SocketManager {
  private static instance: SocketManager;
  private interestedUsers: Map<string, User[]>;
  private userRoomMappping: Map<string, string>;

  private constructor() {
    this.interestedUsers = new Map<string, User[]>();
    this.userRoomMappping = new Map<string, string>();
  }

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }

    return SocketManager.instance;
  }

  addUserToRoom(roomId: string, user: User) {
    if (!this.interestedUsers.has(roomId)) {
      this.interestedUsers.set(roomId, []);
    }

    this.interestedUsers.get(roomId)?.push(user);
    this.userRoomMappping.set(user.id, roomId);
  }

  broadcast(roomId: string, message: string) {
    this.interestedUsers.get(roomId)?.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user: User) {
    const roomId = this.userRoomMappping.get(user.id);
    if (!roomId) {
      return;
    }

    const users = this.interestedUsers.get(roomId);
    if (!users) {
      return;
    }

    this.interestedUsers.set(
      roomId,
      users.filter((x) => x.id !== user.id)
    );
    if (this.interestedUsers.get(roomId)?.length === 0) {
      this.interestedUsers.delete(roomId);
    }

    this.userRoomMappping.delete(user.id);
  }
}

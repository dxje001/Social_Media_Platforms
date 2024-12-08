// websocket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';  // Uvozite io funkciju iz socket.io-client

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;

  constructor() {
    // Kreirajte socket vezu koristeći io
    this.socket = io('http://localhost:5000');
  }

  // Method to emit events
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Method to listen for events
  on(eventName: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }

  // Method to disconnect the socket
  disconnect(): void {
    this.socket.disconnect();
  }

  connect() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });
  }

  sendMessage(message: string) {
    this.socket.emit('new_post', message);
  }
}

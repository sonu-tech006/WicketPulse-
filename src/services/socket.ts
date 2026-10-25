import { io, Socket } from 'socket.io-client';
import { MatchDetails, BallCommentary } from '../types/cricket';

class CricketSocketManager {
  private socket: Socket | null = null;
  private subscribedMatchId: string | null = null;
  private isConnected: boolean = false;

  public connect() {
    if (this.socket) return this.socket;

    this.socket = io(window.location.origin, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      if (this.subscribedMatchId) {
        this.socket?.emit('match:subscribe', this.subscribedMatchId);
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    return this.socket;
  }

  public subscribeToMatch(
    matchId: string,
    onScoreUpdate?: (match: MatchDetails) => void,
    onCommentary?: (ball: BallCommentary) => void
  ) {
    const socket = this.connect();
    this.subscribedMatchId = matchId;
    socket.emit('match:subscribe', matchId);

    if (onScoreUpdate) {
      socket.off('score:update');
      socket.on('score:update', onScoreUpdate);
    }

    if (onCommentary) {
      socket.off('commentary:new');
      socket.on('commentary:new', onCommentary);
    }
  }

  public unsubscribeFromMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('match:unsubscribe', matchId);
      this.socket.off('score:update');
      this.socket.off('commentary:new');
    }
    if (this.subscribedMatchId === matchId) {
      this.subscribedMatchId = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const cricketSocket = new CricketSocketManager();

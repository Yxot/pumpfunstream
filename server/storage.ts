import { type User, type InsertUser, type LeaderboardEntry, type GameStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserBySolanaAddress(address: string): Promise<User | undefined>;
  incrementUserClicks(userId: string): Promise<User>;
  purchaseTickets(userId: string, quantity: number): Promise<User>;
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getGlobalClicks(): Promise<number>;
  incrementGlobalClicks(): Promise<void>;
  getGameStats(): Promise<GameStats>;
  getOnlineUsers(): Promise<number>;
  addOnlineUser(userId: string): Promise<void>;
  removeOnlineUser(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private globalClicks: number;
  private onlineUsers: Set<string>;
  private nextDrawTime: number;
  private prizePool: number;

  constructor() {
    this.users = new Map();
    this.globalClicks = 0;
    this.onlineUsers = new Set();
    this.nextDrawTime = Date.now() + 24 * 60 * 60 * 1000;
    this.prizePool = 0.05;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(
      u => u.solanaAddress === insertUser.solanaAddress
    );
    
    if (existingUser) {
      throw new Error("Solana address already registered");
    }

    const id = randomUUID();
    const user: User = {
      id,
      name: insertUser.name,
      solanaAddress: insertUser.solanaAddress,
      clicks: 0,
      tickets: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserBySolanaAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.solanaAddress === address
    );
  }

  async incrementUserClicks(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    user.clicks += 1;
    this.users.set(userId, user);
    return user;
  }

  async purchaseTickets(userId: string, quantity: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const clicksCost = quantity * 1000;
    if (user.clicks < clicksCost) {
      throw new Error("Not enough clicks");
    }
    
    user.clicks -= clicksCost;
    user.tickets += quantity;
    
    const randomIncrease = Math.random() * 0.1 + 0.01;
    this.prizePool += randomIncrease;
    
    this.users.set(userId, user);
    return user;
  }

  async getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    const sortedUsers = Array.from(this.users.values())
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

    return sortedUsers.map((user, index) => ({
      id: user.id,
      name: user.name,
      clicks: user.clicks,
      tickets: user.tickets,
      rank: index + 1,
    }));
  }

  async getGlobalClicks(): Promise<number> {
    return this.globalClicks;
  }

  async incrementGlobalClicks(): Promise<void> {
    this.globalClicks += 1;
  }

  async getGameStats(): Promise<GameStats> {
    return {
      globalClicks: this.globalClicks,
      prizePool: this.prizePool,
      nextDrawTime: this.nextDrawTime,
      onlineUsers: this.onlineUsers.size,
    };
  }

  async getOnlineUsers(): Promise<number> {
    return this.onlineUsers.size;
  }

  async addOnlineUser(userId: string): Promise<void> {
    this.onlineUsers.add(userId);
  }

  async removeOnlineUser(userId: string): Promise<void> {
    this.onlineUsers.delete(userId);
  }
}

export const storage = new MemStorage();

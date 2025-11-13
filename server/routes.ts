import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, ticketPurchaseSchema } from "@shared/schema";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const connectedClients = new Map<string, WebSocket>();

function broadcast(message: any, excludeUserId?: string) {
  const messageStr = JSON.stringify(message);
  connectedClients.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

async function broadcastStats() {
  const stats = await storage.getGameStats();
  broadcast({ type: "stats_update", data: stats });
}

async function broadcastLeaderboard() {
  const leaderboard = await storage.getLeaderboard(20);
  broadcast({ type: "leaderboard_update", data: leaderboard });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    let userId: string | null = null;

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "join" && message.userId) {
          userId = message.userId;
          connectedClients.set(userId, ws);
          await storage.addOnlineUser(userId);
          await broadcastStats();
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", async () => {
      if (userId) {
        connectedClients.delete(userId);
        await storage.removeOnlineUser(userId);
        await broadcastStats();
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      
      (req as AuthenticatedRequest).userId = user.id;
      
      res.json(user);
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        res.status(409).json({ message: "Solana address already registered" });
      } else if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Signup failed" });
      }
    }
  });

  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }

      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/click", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }

      const user = await storage.incrementUserClicks(userId);
      await storage.incrementGlobalClicks();

      const milestones = [10, 50, 100, 500, 1000, 5000, 10000];
      if (milestones.includes(user.clicks)) {
        const userWs = connectedClients.get(userId);
        if (userWs && userWs.readyState === WebSocket.OPEN) {
          userWs.send(JSON.stringify({
            type: "milestone",
            clicks: user.clicks,
          }));
        }
      }

      await broadcastStats();
      await broadcastLeaderboard();

      res.json({ success: true, clicks: user.clicks });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Click failed" });
    }
  });

  app.post("/api/tickets/purchase", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      const validatedData = ticketPurchaseSchema.parse({ quantity: req.body.quantity });

      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }

      const user = await storage.purchaseTickets(userId, validatedData.quantity);
      
      await broadcastStats();
      await broadcastLeaderboard();

      res.json({ success: true, tickets: user.tickets });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid quantity", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message || "Purchase failed" });
      }
    }
  });

  app.get("/api/leaderboard", async (_req: Request, res: Response) => {
    try {
      const leaderboard = await storage.getLeaderboard(20);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getGameStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return httpServer;
}

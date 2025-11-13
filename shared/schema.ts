import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  solanaAddress: text("solana_address").notNull().unique(),
  clicks: integer("clicks").notNull().default(0),
  tickets: integer("tickets").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  solanaAddress: true,
}).extend({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  solanaAddress: z.string().min(32, "Invalid Solana address").max(44, "Invalid Solana address"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface ClickEvent {
  userId: string;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  clicks: number;
  tickets: number;
  rank: number;
}

export interface GameStats {
  globalClicks: number;
  prizePool: number;
  nextDrawTime: number;
  onlineUsers: number;
}

export interface TicketPurchase {
  quantity: number;
  totalCost: number;
}

export const ticketPurchaseSchema = z.object({
  quantity: z.number().min(1).max(100),
});

export type TicketPurchaseInput = z.infer<typeof ticketPurchaseSchema>;

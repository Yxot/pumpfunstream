import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "@shared/schema";
import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/10 border-gray-400/30";
    if (rank === 3) return "bg-orange-600/10 border-orange-600/30";
    return "";
  };

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Top Clickers
        </h2>
      </div>
      
      <div className="space-y-2" data-testid="leaderboard">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No players yet. Be the first to click!</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              data-testid={`leaderboard-entry-${index}`}
            >
              <div
                className={`flex items-center gap-4 p-4 rounded-md border transition-colors ${
                  getRankStyle(entry.rank)
                } ${
                  entry.id === currentUserId 
                    ? "bg-primary/10 border-primary/50" 
                    : "bg-card/50 hover-elevate"
                }`}
              >
                <div className="flex items-center justify-center w-12 min-w-[3rem]">
                  {getRankIcon(entry.rank) || (
                    <span className="text-xl font-mono font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 
                      className={`font-semibold truncate ${
                        entry.id === currentUserId ? "text-primary" : "text-foreground"
                      }`}
                      data-testid={`player-name-${index}`}
                    >
                      {entry.name}
                    </h3>
                    {entry.id === currentUserId && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  {entry.tickets > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {entry.tickets} {entry.tickets === 1 ? "ticket" : "tickets"}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <div 
                    className="text-2xl md:text-3xl font-mono font-bold text-primary"
                    data-testid={`player-clicks-${index}`}
                  >
                    {entry.clicks.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">clicks</div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}

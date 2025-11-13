import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ClickButton } from "@/components/ClickButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { StatCard } from "@/components/StatCard";
import { Leaderboard } from "@/components/Leaderboard";
import { TicketPurchase } from "@/components/TicketPurchase";
import { AuthDialog } from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, GameStats, LeaderboardEntry } from "@shared/schema";
import { MousePointer2, Users, Trophy, Coins, TrendingUp } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { motion } from "framer-motion";

export default function Game() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 3000,
  });

  const { data: userData } = useQuery<User>({
    queryKey: ["/api/user", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("No user");
      const response = await fetch(`/api/user?userId=${currentUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    enabled: !!currentUser,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("clickGameUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("clickGameUser");
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(JSON.stringify({ type: "join", userId: currentUser.id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === "stats_update") {
        queryClient.setQueryData(["/api/stats"], message.data);
      } else if (message.type === "leaderboard_update") {
        queryClient.setQueryData(["/api/leaderboard"], message.data);
      } else if (message.type === "milestone") {
        toast({
          title: "Milestone Reached! 🎉",
          description: `You've reached ${message.clicks} clicks!`,
        });
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [currentUser, toast]);

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; solanaAddress: string }) => {
      return await apiRequest("POST", "/api/signup", data);
    },
    onSuccess: (user: User) => {
      setCurrentUser(user);
      localStorage.setItem("clickGameUser", JSON.stringify(user));
      setShowAuthDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Welcome to $CLICK! 🎮",
        description: "Start clicking to climb the leaderboard!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const clickMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("Not logged in");
      return await apiRequest("POST", "/api/click", { userId: currentUser.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const purchaseTicketsMutation = useMutation({
    mutationFn: async (quantity: number) => {
      if (!currentUser) throw new Error("Not logged in");
      return await apiRequest("POST", "/api/tickets/purchase", { 
        userId: currentUser.id, 
        quantity 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user", currentUser?.id] });
      toast({
        title: "Tickets Purchased! 🎫",
        description: "Your winning chances have increased!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleClick = () => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }
    clickMutation.mutate();
  };

  const handlePurchaseTickets = (quantity: number) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }
    purchaseTicketsMutation.mutate(quantity);
  };

  const nextDrawTime = gameStats?.nextDrawTime || Date.now() + 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        <section className="text-center space-y-6 md:space-y-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-foreground mb-4"
                style={{
                  background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                data-testid="title-main"
            >
              $CLICK
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              A totally unnecessary game of greatness.
            </p>
          </motion.div>

          {!currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={() => setShowAuthDialog(true)}
                size="lg"
                className="text-lg font-semibold px-8"
                data-testid="button-get-started"
              >
                Start Clicking
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12"
          >
            <div className="mb-6">
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                Global Clicks
              </p>
              <div 
                className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold text-foreground"
                data-testid="global-clicks"
              >
                {gameStats?.globalClicks?.toLocaleString() || "0"}
              </div>
            </div>
            
            <ClickButton onClick={handleClick} disabled={!currentUser} />
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Next Winners In"
            value={<CountdownTimer targetTime={nextDrawTime} />}
            icon={Trophy}
            highlight
            testId="countdown"
          />
          <StatCard
            title="Prize Pool"
            value={
              <div className="flex items-center gap-2 text-4xl md:text-5xl lg:text-6xl" data-testid="prize-pool">
                <SiSolana className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                <span>{gameStats?.prizePool?.toFixed(2) || "0.00"}</span>
              </div>
            }
            subtitle="SOL available in rewards"
            icon={Coins}
            testId="prize-pool-value"
          />
          <StatCard
            title="Your Clicks"
            value={userData?.clicks || 0}
            subtitle={userData?.tickets ? `${userData.tickets} tickets owned` : "No tickets yet"}
            icon={MousePointer2}
            testId="user-clicks"
          />
        </section>

        {currentUser && (
          <section>
            <TicketPurchase
              onPurchase={handlePurchaseTickets}
              isPending={purchaseTicketsMutation.isPending}
              currentTickets={userData?.tickets || 0}
              currentClicks={userData?.clicks || 0}
            />
          </section>
        )}

        <section>
          <Leaderboard entries={leaderboard} currentUserId={currentUser?.id} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
          <div className="text-center p-8">
            <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-display font-bold mb-4">Join the Movement</h3>
            <p className="text-muted-foreground leading-relaxed">
              Be part of a global phenomenon. Every click matters.
            </p>
          </div>
          <div className="text-center p-8">
            <SiSolana className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-display font-bold mb-4">$CLICK Together</h3>
            <p className="text-muted-foreground leading-relaxed">
              Compete for SOL rewards and grow the daily prize pools.
            </p>
          </div>
          <div className="text-center p-8">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-display font-bold mb-4">Daily Prize Competitions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Compete for the top spot, enter daily prize draws.
            </p>
          </div>
        </section>

        <footer className="border-t border-border pt-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">Platform</h4>
              <a 
                href="https://www.pump.fun/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Pump.fun
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Stats</h4>
              <p className="text-sm text-muted-foreground">
                {gameStats?.onlineUsers || 0} players online
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Blockchain</h4>
              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                <SiSolana className="w-3 h-3" />
                Solana
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Game</h4>
              <p className="text-sm text-muted-foreground">
                v1.0.0
              </p>
            </div>
          </div>
        </footer>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSubmit={signupMutation.mutateAsync}
        isPending={signupMutation.isPending}
      />
    </div>
  );
}

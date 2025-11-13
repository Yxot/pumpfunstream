import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Minus, Plus, MousePointer2 } from "lucide-react";
import { SiSolana } from "react-icons/si";

interface TicketPurchaseProps {
  onPurchase: (quantity: number) => void;
  isPending?: boolean;
  currentTickets: number;
  currentClicks: number;
}

const CLICKS_PER_TICKET = 1000;

export function TicketPurchase({ onPurchase, isPending, currentTickets, currentClicks }: TicketPurchaseProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(100, prev + delta)));
  };

  const totalCost = quantity * CLICKS_PER_TICKET;
  const canAfford = currentClicks >= totalCost;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <Ticket className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
              Increase Your Chances
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Use your clicks to buy tickets and multiply your winning odds. Each ticket costs 1,000 clicks 
              and gives you an additional entry into the prize draw!
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-md bg-muted/30 border border-border">
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Your Tickets:</span>
            <span className="font-mono font-bold text-foreground" data-testid="user-tickets">
              {currentTickets}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-primary/20">
        <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-6">
          Buy Tickets
        </h3>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="quantity" className="text-sm font-medium mb-3 block">
              Quantity
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isPending}
                data-testid="button-decrease-quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="text-center font-mono text-2xl h-12 flex-1"
                disabled={isPending}
                data-testid="input-ticket-quantity"
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 100 || isPending}
                data-testid="button-increase-quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum 100 tickets per purchase
            </p>
          </div>

          <div className="p-4 rounded-md bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Price per ticket</span>
              <span className="font-mono text-sm flex items-center gap-1">
                <MousePointer2 className="w-3 h-3 text-primary" />
                {CLICKS_PER_TICKET.toLocaleString()} clicks
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-primary/20">
              <span className="font-semibold">Total Cost</span>
              <span className="text-2xl font-mono font-bold text-primary flex items-center gap-2">
                <MousePointer2 className="w-5 h-5" />
                {totalCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/20">
              <span className="text-xs text-muted-foreground">Your Clicks</span>
              <span className={`text-sm font-mono font-semibold ${canAfford ? 'text-primary' : 'text-destructive'}`}>
                {currentClicks.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onPurchase(quantity)}
            disabled={isPending || !canAfford}
            size="lg"
            className="w-full text-lg font-semibold"
            data-testid="button-purchase-tickets"
          >
            {isPending ? "Processing..." : !canAfford ? "Not Enough Clicks" : `Buy ${quantity} ${quantity === 1 ? "Ticket" : "Tickets"}`}
          </Button>
        </div>
      </Card>
    </div>
  );
}

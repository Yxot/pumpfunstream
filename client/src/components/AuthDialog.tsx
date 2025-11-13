import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SiSolana } from "react-icons/si";
import { Sparkles } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; solanaAddress: string }) => Promise<void>;
  isPending?: boolean;
}

export function AuthDialog({ open, onOpenChange, onSubmit, isPending }: AuthDialogProps) {
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      solanaAddress: "",
    },
  });

  const handleSubmit = async (data: { name: string; solanaAddress: string }) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl font-display font-bold">
              Join the Game
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Enter your details to start clicking and competing for SOL rewards.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      disabled={isPending}
                      data-testid="input-name"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solanaAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <SiSolana className="w-4 h-4 text-primary" />
                    Solana Wallet Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your SOL address"
                      disabled={isPending}
                      data-testid="input-solana-address"
                      className="h-11 font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your SOL address for receiving prize payouts
                  </p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full text-base font-semibold"
              data-testid="button-signup"
            >
              {isPending ? "Creating Account..." : "Start Clicking"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ClickButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ClickButton({ onClick, disabled }: ClickButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    onClick();
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="relative flex items-center justify-center p-8">
      <motion.div
        animate={{
          scale: isPressed ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        className="relative"
      >
        <div 
          className="relative rounded-full p-1 animate-glow"
          style={{
            width: '16rem',
            height: '16rem',
          }}
        >
          <Button
            onClick={handleClick}
            disabled={disabled}
            data-testid="button-click"
            size="lg"
            className="w-full h-full rounded-full bg-primary text-primary-foreground font-display font-black text-4xl md:text-5xl"
          >
            <span className="relative z-10">CLICK</span>
          </Button>
        </div>
        
        {isPressed && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full border-4 border-primary pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
}

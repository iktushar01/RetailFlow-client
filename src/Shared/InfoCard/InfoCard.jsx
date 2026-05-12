import React from 'react';
import { Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils"; // Standard shadcn utility

/**
 * Reusable Info/Alert Card Component utilizing Shadcn/Tailwind v4 theme variables
 */
const InfoCard = ({ type = 'info', title, message, icon: Icon, children, className }) => {
  // Mapping types to your theme-aware semantic colors
  const typeConfigs = {
    info: {
      styles: "bg-muted/50 border-border text-foreground",
      iconColor: "text-primary",
      defaultIcon: Info
    },
    warning: {
      // Using a slight transparency on foreground for the warning 'feel' if specific warning vars aren't in theme
      styles: "bg-secondary/50 border-border text-foreground",
      iconColor: "text-chart-4", 
      defaultIcon: AlertTriangle
    },
    success: {
      styles: "bg-accent/30 border-border text-foreground",
      iconColor: "text-primary",
      defaultIcon: CheckCircle2
    },
    error: {
      styles: "bg-destructive/10 border-destructive/20 text-destructive",
      iconColor: "text-destructive",
      defaultIcon: AlertCircle
    }
  };

  const config = typeConfigs[type] || typeConfigs.info;
  const EffectiveIcon = Icon || config.defaultIcon;

  return (
    <div 
      className={cn(
        "relative w-full rounded-lg border p-4 flex items-start gap-3 transition-colors",
        config.styles,
        className
      )}
    >
      {EffectiveIcon && (
        <EffectiveIcon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      )}
      <div className="flex-1">
        {title && (
          <h5 className="font-semibold leading-none tracking-tight mb-1">
            {title}
          </h5>
        )}
        {message && (
          <div className="text-sm opacity-90 leading-relaxed">
            {message}
          </div>
        )}
        {children && <div className="mt-2 text-sm">{children}</div>}
      </div>
    </div>
  );
};

export default InfoCard;
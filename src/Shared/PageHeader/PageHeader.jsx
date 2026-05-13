import React from 'react';
import { Button } from '../../Components/UI/Button';
import { cn } from "@/lib/utils"; // Standard shadcn utility helper

/**
 * Reusable Page Header Component
 * Theme-aware using Shadcn/Tailwind v4 variables
 */
const PageHeader = ({ title, subtitle, icon: Icon, actions = [], children, className }) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border p-6 mb-6 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:mt-2 md:mt-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'} // Shadcn uses 'default' instead of 'primary'
                size={action.size || 'default'}
                onClick={action.onClick}
                disabled={action.disabled}
                className="gap-2" // Tailwind v4/Shadcn standard for spacing icons
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

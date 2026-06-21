import React from 'react';
import { Button } from '../../Components/UI/button';
import { Separator } from '../../Components/UI/separator';
import { cn } from "@/lib/utils";

/**
 * Corporate page header — matches dashboard overview style.
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  actions = [],
  children,
  className,
  showSeparator = false,
}) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {breadcrumb && (
        <div className="text-sm text-muted-foreground">{breadcrumb}</div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {(actions.length > 0 || children) && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    size={action.size || 'default'}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="gap-2"
                  >
                    {action.icon && <action.icon className="w-4 h-4" />}
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            )}
            {children}
          </div>
        )}
      </div>

      {showSeparator && <Separator className="opacity-50" />}
    </div>
  );
};

export default PageHeader;

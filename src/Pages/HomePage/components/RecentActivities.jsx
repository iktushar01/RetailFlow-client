import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const RecentActivities = ({ data }) => {
  return (
    <Card className="bg-card/70 backdrop-blur border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border ml-[3px]" />
            
            <ul className="space-y-6">
              {data.recentActivities && data.recentActivities.length > 0 ? (
                data.recentActivities.map((activity, i) => (
                  <li key={activity.id || i} className="relative pl-8">
                    {/* Timeline Dot */}
                    <span 
                      className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" 
                    />
                    
                    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                      <p className="text-sm font-semibold leading-none tracking-tight">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                      <time className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </li>
                ))
              ) : (
                <li className="relative pl-8">
                  <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-muted bg-background" />
                  <div className="rounded-lg border border-dashed border-border p-3">
                    <p className="text-sm text-muted-foreground italic">No recent activities found.</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RecentActivities
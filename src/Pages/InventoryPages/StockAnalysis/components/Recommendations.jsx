import React from 'react'
import { AlertTriangle, TrendingUp, PackageSearch, Trash2, ArrowRight } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Recommendations = () => {
  const cards = [
    {
      title: "Fast Moving Products",
      description: "High demand detected. Consider increasing stock levels and promoting these items to maximize revenue.",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary border-primary/20",
      iconColor: "text-primary",
      action: "Optimize Inventory"
    },
    {
      title: "Slow Moving Products",
      description: "Low turnover rate. Review pricing, marketing strategies, or consider bundling with higher-performing items.",
      icon: PackageSearch,
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      iconColor: "text-amber-600",
      action: "Review Strategy"
    },
    {
      title: "Dead Stock",
      description: "No movement detected. Consider clearance sales or disposal to free up valuable warehouse space.",
      icon: Trash2,
      color: "bg-destructive/10 text-destructive border-destructive/20",
      iconColor: "text-destructive",
      action: "Liquidate Assets"
    }
  ]

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          Strategic Recommendations
        </CardTitle>
        <CardDescription>
          Automated insights based on current stock velocity and sales performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all hover:shadow-md ${item.color}`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-background shadow-sm`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h4 className="font-bold tracking-tight">{item.title}</h4>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-current/10 flex items-center justify-between group cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider">{item.action}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Recommendations
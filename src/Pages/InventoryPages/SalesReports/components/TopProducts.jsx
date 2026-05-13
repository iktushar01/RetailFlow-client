import React from 'react'
import { BarChart3, Trophy, ArrowUpRight } from 'lucide-react'

const TopProducts = ({ topProducts = [], formatCurrency }) => {
  // Find the max revenue to calculate relative progress bar widths
  const maxRevenue = Math.max(...topProducts.map(p => p.revenue), 1)

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Top 5 Performance
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
          By Revenue
        </span>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => {
          const percentage = (product.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className={`
                    flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-black
                    ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    0{index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-foreground truncate max-w-[140px]">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {product.quantity.toLocaleString()} units shifted
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-foreground flex items-center justify-end gap-1">
                    {formatCurrency(product.revenue)}
                    {index === 0 && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/60">
                    Total Revenue
                  </div>
                </div>
              </div>

              {/* Progress Bar visualization */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    index === 0 ? 'bg-primary' : 'bg-primary/40'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}

        {topProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground/20 mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No sales data recorded</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopProducts

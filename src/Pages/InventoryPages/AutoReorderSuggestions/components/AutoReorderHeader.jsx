import React from 'react'
import { CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from "@/Components/UI/button"

const AutoReorderHeader = ({ onGenerateAll, onRefresh, hasSuggestions }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
          Auto Reorder Suggestions
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Review suggested reorder quantities based on stock levels.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          onClick={onGenerateAll}
          disabled={!hasSuggestions}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Generate All
        </Button>
        <Button variant="outline" onClick={onRefresh} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}

export default AutoReorderHeader

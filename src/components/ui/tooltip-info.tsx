import * as React from "react"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

interface InfoTooltipProps {
  content: React.ReactNode;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="inline-block w-4 h-4 text-muted-foreground hover:text-foreground transition-colors ml-1 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[250px] text-center">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

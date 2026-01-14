import { type InputHTMLAttributes, forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"

interface PixelPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const PixelPasswordInput = forwardRef<HTMLInputElement, PixelPasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className="space-y-2">
        {label && <label className="block text-xs uppercase tracking-wider">{label}</label>}
        <InputGroup className={cn("border-4 border-border rounded-none h-auto bg-input", className)}>
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 text-xs bg-transparent border-none outline-none focus:ring-0",
              "placeholder:text-muted-foreground",
            )}
            {...props}
            type={showPassword ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="hover:bg-gray-200"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? "Hide password" : "Show password"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </InputGroupAddon>
        </InputGroup>
      </div>
    )
  }
)

PixelPasswordInput.displayName = "PixelPasswordInput"

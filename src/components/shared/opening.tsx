import { ReactNode } from 'react'
import { TextEffect } from '@/components/registries/text-effect'
import { hulkFont } from '@/fonts/font'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type OpeningProps = {
   heading: string
   paragraph: string
   badge?: string
   children?: ReactNode
   className?: string
}

export function Opening({ 
   heading, 
   paragraph, 
   badge, 
   children, 
   className 
}: OpeningProps) {
   return (
      <section className={cn(
         "flex justify-center items-center px-4 py-12 md:py-16",
         className
      )}>
         <div className={cn(
            "relative max-w-3xl w-full",
            "flex flex-col items-center justify-center text-center",
            "rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20",
            "shadow-lg backdrop-blur-sm",
            "p-6 md:p-10 transition-all duration-300",
            "hover:shadow-xl hover:border-border"
         )}>
            {/* Optional decorative blur */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-50" />

            {/* Badge */}
            {badge && (
               <Badge 
                  variant="secondary" 
                  className="mb-4 px-3 py-1 text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
               >
                  {badge}
               </Badge>
            )}

            {/* Heading with text effect */}
            <h1 className={cn(
               hulkFont.className,
               "scroll-m-20 text-center text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight",
               "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
               "max-w-2xl mx-auto"
            )}>
               {heading}
            </h1>

            {/* Paragraph */}
            <p className="text-muted-foreground text-sm md:text-base max-w-[85%] mx-auto mt-4 leading-relaxed">
               {paragraph}
            </p>

            {/* Children (buttons, links, etc.) */}
            {children && (
               <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {children}
               </div>
            )}
         </div>
      </section>
   )
}
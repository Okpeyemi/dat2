"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import {
  GridIcon,
  MapsIcon,
  CloudIcon,
  FlashIcon,
  RadioButtonIcon,
  WifiIcon,
  ActivityIcon,
  PlayIcon,
  Key01Icon,
  UserIcon,
  File01Icon,
  SmileIcon,
  StarIcon,
  Sun01Icon,
  Moon01Icon,
} from "@hugeicons/core-free-icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NavItem = {
  icon: IconSvgElement
  label: string
  active?: boolean
}

const topNavItems: NavItem[] = [
  { icon: MapsIcon, label: "Carte", active: true },
//   { icon: CloudIcon, label: "Cloud" },
//   { icon: FlashIcon, label: "Activité" },
//   { icon: RadioButtonIcon, label: "Statut" },
//   { icon: WifiIcon, label: "Réseau" },
]

const midNavItems: NavItem[] = [
//   { icon: ActivityIcon, label: "Déclencheurs" },
//   { icon: PlayIcon, label: "Exécuter" },
//   { icon: Key01Icon, label: "Clés" },
//   { icon: UserIcon, label: "Utilisateurs" },
//   { icon: File01Icon, label: "Fichiers" },
]

const bottomNavItems: NavItem[] = [
  { icon: SmileIcon, label: "Feedbacks", active: true },
//   { icon: StarIcon, label: "Copilot" },
]

function SidebarIcon({
  icon,
  label,
  active,
}: NavItem) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={label}
          className={cn(
            "transition-colors",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              : "text-sidebar-foreground/50 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
          )}
        >
          <HugeiconsIcon
            icon={icon}
            size={18}
            strokeWidth={active ? 2.5 : 2}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export function IconSidebar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <TooltipProvider>
      <aside className="flex h-screen w-14 flex-col items-center bg-sidebar py-3 gap-1 border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground font-bold text-lg mb-2 select-none">
          G
        </div>

        {/* Top nav */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {topNavItems.map((item) => (
            <SidebarIcon key={item.label} {...item} />
          ))}

          {/* Separator */}
          <div className="my-2 w-5 border-t border-sidebar-border" />

          {midNavItems.map((item) => (
            <SidebarIcon key={item.label} {...item} />
          ))}
        </nav>

        {/* Bottom nav */}
        <nav className="flex flex-col items-center gap-1">
        {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Changer le thème"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-sidebar-foreground/50 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
              >
                {mounted && (
                  <HugeiconsIcon
                    icon={theme === "dark" ? Sun01Icon : Moon01Icon}
                    size={18}
                    strokeWidth={2}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {mounted && (theme === "dark" ? "Mode clair" : "Mode sombre")}
            </TooltipContent>
          </Tooltip>
          {bottomNavItems.map((item) => (
            <SidebarIcon key={item.label} {...item} />
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  )
}

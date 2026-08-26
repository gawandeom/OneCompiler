import { Button } from "./ui/button";
import { Moon, Sun, TerminalSquare, Play, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, LANGUAGE_LIST, type ExecutionLanguage } from "@/lib/languages";

type NavBarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: ExecutionLanguage;
  onLanguageChange: (language: ExecutionLanguage) => void;
  onRun: () => void;
  isRunning: boolean;
};

function NavBar({ theme, onToggleTheme, language, onLanguageChange, onRun, isRunning }: NavBarProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur px-6">
      <div className="flex items-center gap-2">
        <TerminalSquare className="h-6 w-6 text-primary" />
        <h1 className="font-semibold text-lg tracking-tight">
          Gawande <span className="text-primary">Compiler</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <img src={LANGUAGES[language].icon} alt={language} className="h-4 w-4" />
              {LANGUAGES[language].label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              {LANGUAGE_LIST.map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={language === key}
                  onCheckedChange={(checked) => checked && onLanguageChange(key)}
                >
                  <img src={LANGUAGES[key].icon} alt={key} className="inline h-4 w-4 mr-2" />
                  {LANGUAGES[key].label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onRun} disabled={isRunning} className="gap-2">
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run
              <kbd className="ml-1 hidden sm:inline text-[10px] font-mono bg-primary-foreground/20 rounded px-1.5 py-0.5">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onToggleTheme} title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline">Save</Button>
        <Button>Login</Button>
      </div>
    </div>
  );
}

export default NavBar;
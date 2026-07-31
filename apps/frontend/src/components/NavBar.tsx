import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import jssvg from "../../styles/javascript-logo-svgrepo-com.svg"
type NavBarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  // onRun now receives the selected language
  onRun: (language: "js" | "py" | "cpp") => void;
};

function NavBar({ theme, onToggleTheme, onRun }: NavBarProps) {
  const [language, setLanguage] = useState<"js" | "py" | "cpp">("js");
  
  return (
    <div className="flex h-20 w-full items-center justify-between border-b border-border bg-background/95 px-6">
      <div>
        <h1 className="font-semibold text-2xl">Gawande Compiler</h1>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <Button variant={"outline"}>{language}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={language === "js"}
                onCheckedChange={(checked) => checked && setLanguage("js")}
              >
                <img src={jssvg} alt="JavaScript" className="inline h-4 w-4 mr-2" />
                JavaScript
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={language === "py"}
                onCheckedChange={(checked) => checked && setLanguage("py")}
              >
                
                Python
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={() => onRun(language)}>Run</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onToggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
        <Button>Save</Button>
        <Button>Login</Button>
      </div>
    </div>
  );
}

export default NavBar;

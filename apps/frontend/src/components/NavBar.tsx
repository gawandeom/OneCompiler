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
import jssvg from "../../styles/javascript-logo-svgrepo-com.svg"
import pysvg from "../../styles/python-logo-svgrepo-com.svg"
import cppsvg from "../../styles/cpp-logo-svgrepo-com.svg"



type NavBarProps = {
  
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: "js" | "py" | "cpp"|"java";
  onLanguageChange: (language: "js" | "py" | "cpp"|"java") => void;
  onRun: () => void;
};

function NavBar({ theme, onToggleTheme, language, onLanguageChange, onRun }: NavBarProps) {
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
                onCheckedChange={(checked) => checked && onLanguageChange("js")}
              >
                <img src={jssvg} alt="JavaScript" className="inline h-4 w-4 mr-2" />
                JavaScript
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={language === "py"}
                onCheckedChange={(checked) => checked && onLanguageChange("py")}
              >
                <img src={pysvg} alt="Python" className="inline h-4 w-4 mr-2" />
                Python
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={language === "cpp"}
                onCheckedChange={(checked) => checked && onLanguageChange("cpp")}
              >
                <img src={cppsvg} alt="C++" className="inline h-4 w-4 mr-2" />
                C++
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={language === "java"}
                onCheckedChange={(checked) => checked && onLanguageChange("java")}
              >
                <img src={cppsvg} alt="java" className="inline h-4 w-4 mr-2" />
                Java
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onRun}>Run</Button>
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

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

type NavBarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onRun: () => void
 
};

function NavBar({ theme, onToggleTheme, onRun }: NavBarProps) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b border-border bg-background/95 px-6">
      <div>
        <h1 className="font-semibold text-2xl">OneCompiler</h1>
      </div>
      <div className="flex gap-3">
        <Button variant="outline">HTML</Button>
        <Button onClick={onRun} >Run</Button>
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

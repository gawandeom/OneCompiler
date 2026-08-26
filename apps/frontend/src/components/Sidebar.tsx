import { LANGUAGES, type ExecutionLanguage } from "@/lib/languages";

function Sidebar({ language }: { language: ExecutionLanguage }) {
  const meta = LANGUAGES[language];
  return (
    <div className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-background/50">
      <div className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground">
        EXPLORER
      </div>
      <div className="flex items-center gap-2 mx-2 px-3 py-2 rounded-md bg-accent text-sm">
        <img src={meta.icon} alt={language} className="h-4 w-4" />
        <span>{meta.fileName}</span>
      </div>
      <div className="mt-auto px-4 py-3 text-[11px] text-muted-foreground border-t border-border">
        Multi-file support coming soon
      </div>
    </div>
  );
}

export default Sidebar;
'use client';

import { cn } from "@/lib/utils";
import { useRightPane } from "./split-layout-context";

type Props = {
  children: React.ReactNode;
};

const SplitLayout = ({ children }: Props) => {
  const { rightPaneContent } = useRightPane();

  return (
    <div className="flex w-full">
      <div className={cn(
        "transition-all duration-200",
        rightPaneContent ? "pr-[50%]" : "w-full"
      )}>
        {children}
      </div>
      {rightPaneContent && (
        <div className="w-1/2 border-l border-slate-700 fixed top-0 right-0 bottom-0 overflow-y-auto bg-slate-900">
          <div className="p-6 pt-24">
            {rightPaneContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitLayout; 
import React from "react";

interface TerminalLineProps {
  prompt?: string;
  command?: string;
  output?: string;
  type: "command" | "output" | "system" | "accent";
}

export default function TerminalLine({
  prompt,
  command,
  output,
  type,
}: TerminalLineProps) {
  if (type === "command") {
    return (
      <div className="font-mono text-sm text-[#c0a882]">
        <span>$ </span>
        {prompt && <span className="text-[#666666]">{prompt} </span>}
        <span>{command}</span>
      </div>
    );
  }
  if (type === "output") {
    return (
      <div className="font-mono text-sm text-[#999999]">{output ?? command}</div>
    );
  }
  if (type === "system") {
    return (
      <div className="font-mono text-sm text-[#7eb8c9]">{output ?? command}</div>
    );
  }
  return (
    <div className="font-mono text-sm text-white font-medium">
      {output ?? command}
    </div>
  );
}

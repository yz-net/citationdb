import React from "react";
import { twMerge } from "tailwind-merge";
import pluralize from "pluralize";

export default function BigNumber(props: any) {
  return (
    <div className="ml-2 text-[#6e6e6e]">
      <div
        className={twMerge(
          "flex min-w-[7ch] content-center items-center justify-center rounded-lg border-2 bg-[#f5f5f5] p-5 text-xl font-semibold tabular-nums",
          props.className,
        )}
      >
        {props.value}
      </div>
      <div className="text-center mt-0.5 font-sans text-xs text-[#6e6e6e]">
        {pluralize(props.label, props.value)}
      </div>
    </div>
  );
}

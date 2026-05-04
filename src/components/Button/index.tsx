import { twMerge } from "tailwind-merge";

export default function Button(props: any) {
  return (
    <button
      onClick={props.onClick}
      className={twMerge(
        "hover:shadow-yale mx-2.5 h-[30px] rounded-lg bg-[#e8e8e8] px-2.5 text-[13px] font-bold tracking-[.5pt] text-white",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}

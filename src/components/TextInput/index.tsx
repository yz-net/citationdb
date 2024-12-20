import { twMerge } from "tailwind-merge";

export default function TextInput(props: any /* TODO */) {
  return (
    <div
      className={twMerge(
        `relative box-border flex h-9 w-full flex-[2_2] items-center p-0`,
        props.className,
      )}
    >
      <input
        className="absolute inset-0 h-9 border border-[#d3d3d3] bg-white pl-2 pr-7 font-yalenewroman text-lg text-[#222]"
        onChange={(e) => props.onChange(e)}
        value={props.value ?? ""}
        placeholder={props.placeholder}
        type="text"
      />
      <div className="pointer-events-none absolute right-0 flex h-full items-center justify-center px-2">
        <img src="/graphics/search-icon.svg" />
      </div>
    </div>
  );
}

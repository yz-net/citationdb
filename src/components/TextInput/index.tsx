import { twMerge } from "tailwind-merge";
import { assetPath } from "~/utils/paths";

export default function TextInput(props: any /* TODO */) {
  return (
    <div
      className={twMerge(
        `relative box-border flex h-9 w-full flex-[2_2] items-center p-0`,
        props.className,
      )}
    >
      <input
        className="font-yalenewroman absolute inset-0 h-9 border border-[#d3d3d3] bg-white pr-7 pl-2 text-lg text-[#222]"
        onChange={(e) => props.onChange(e)}
        value={props.value ?? ""}
        placeholder={props.placeholder}
        type="text"
      />
      <div className="pointer-events-none absolute right-0 flex h-full items-center justify-center px-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG icon, static export */}
        <img src={assetPath("/graphics/search-icon.svg")} alt="" />
      </div>
    </div>
  );
}

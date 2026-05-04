"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import useLocalDataStore from "~/store/local";

import SaveButton from "../SaveButton";

function SavedItemCounter() {
  const localData = useLocalDataStore();

  const count =
    localData.authorIDsPinned.length +
    localData.publicationIDsPinned.length +
    localData.resourceIDsPinned.length;

  if (count < 1) {
    return null;
  }

  return (
    <Link
      className="hover:shadow-yale box-border flex h-7 flex-col justify-center rounded-lg border-0 bg-[#efefef] px-2.5 py-0 text-center font-bold text-[#6e6e6e] no-underline"
      href="/pins"
      type="button"
    >
      {`${count} ${count === 1 ? "pin" : "pins"}`}
    </Link>
  );
}

function HomeButton() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      className="hover:shadow-yale mr-1 box-border flex h-7 flex-col justify-center rounded-lg border-0 bg-[#efefef] px-2.5 py-0 text-center font-bold text-[#6e6e6e] no-underline"
      href="/"
      type="button"
    >
      home
    </Link>
  );
}

/**
 * Not really a bread crumb menu.
 * @param {Object} props
 */
export default function BreadCrumb(props: any) {
  const id = props.id;
  const saveType = props.saveType ?? "invalid";

  return (
    <nav className="flex min-h-8 justify-between text-sm text-[#6e6e6e]">
      <div className="flex">
        <HomeButton />
        <SavedItemCounter />
      </div>
      <SaveButton
        className={{
          wrapper: "top-0",
          button: "rounded-lg",
        }}
        id={id}
        type={saveType}
      />
    </nav>
  );
}

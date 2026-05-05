"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { footnotes, publications } from "~/utils/data";

import ResultListItem from "./ResultListItem";

function getMostRecentYear(years: number[]) {
  let max = 0;
  for (const y of years) {
    if (y > max) max = y;
  }
  return max;
}

function buildSortYearMap() {
  const publicationYearById = new Map<string, number>();
  const authorYears = new Map<string, number[]>();
  for (const p of publications) {
    const year = Number((p).date) || 0;
    publicationYearById.set(p.id, year);
    for (const aid of (p)["author.id"] ?? []) {
      const arr = authorYears.get(aid) ?? [];
      arr.push(year);
      authorYears.set(aid, arr);
    }
  }
  const resourceYears = new Map<string, number[]>();
  for (const f of footnotes) {
    const pid = (f)["publication.id"];
    const rid = (f)["resource.id"];
    const year = publicationYearById.get(pid) ?? 0;
    const arr = resourceYears.get(rid) ?? [];
    arr.push(year);
    resourceYears.set(rid, arr);
  }
  return { publicationYearById, authorYears, resourceYears };
}

function sortYearFor(
  item: any,
  maps: ReturnType<typeof buildSortYearMap>,
): number {
  if (item.__type === "publication") {
    return maps.publicationYearById.get(item.id) ?? 0;
  }
  if (item.__type === "author") {
    return getMostRecentYear(maps.authorYears.get(item.id) ?? []);
  }
  if (item.__type === "resource") {
    return getMostRecentYear(maps.resourceYears.get(item.id) ?? []);
  }
  return 0;
}

export default function ResultsList(props: any) {
  const [options, setOptions] = useState<{ itemCount: number; step: number }>({
    itemCount: 25,
    step: 10,
  });
  const [prevItems, setPrevItems] = useState(props.items);
  if (prevItems !== props.items) {
    setPrevItems(props.items);
    setOptions((prev) => ({ ...prev, itemCount: 25 }));
  }

  const loadMore = useCallback(() => {
    setOptions((prev) => ({ ...prev, itemCount: prev.itemCount + prev.step }));
  }, []);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = props.items.length > options.itemCount;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "100px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const sortMaps = useMemo(() => buildSortYearMap(), []);
  const hasPublications = props.items.some(
    (x: any) => x.__type === "publication",
  );

  const items = [...props.items]
    .sort((a: any, b: any) => {
      if (hasPublications) {
        const ya = sortYearFor(a, sortMaps);
        const yb = sortYearFor(b, sortMaps);
        if (ya !== yb) return yb - ya;
      }
      return a.__header > b.__header ? 1 : -1;
    })
    .map((x: any, i: number) => (
      <ResultListItem key={i} item={x} type={x.__type} header={x.__header} />
    ))
    .slice(0, options.itemCount);

  return (
    <div className="mt-[30px]">
      {items}
      {hasMore ? <div ref={sentinelRef} /> : null}
    </div>
  );
}

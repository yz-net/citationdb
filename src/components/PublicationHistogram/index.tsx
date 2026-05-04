"use client";

import Histogram from "~/components/Viz/Histogram";
import { yearCounts } from "~/utils/data";

export default function PublicationsHistogram(props: any) {
  const publicationData = yearCounts(
    props.items.filter((item: any) => item.__type === "publication"),
  ) as any[];

  return (
    <div className="flex h-[150px] w-full flex-col">
      <Histogram
        data={publicationData}
        minYear={1975}
        maxYear={new Date().getFullYear() + 1}
        margin={{
          top: 10,
          left: 30,
          right: 10,
          bottom: 25,
        }}
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";

import BigNumber from "~/components/BigNumber";
import BreadCrumb from "~/components/BreadCrumb";
import ResultList from "~/components/ResultList";
import ResultListWrapper from "~/components/ResultListWrapper";
import useLocalDataStore from "~/store/local";

import { authors, publications, resources } from "~/utils/data";

export default function Pins() {
  const localData = useLocalDataStore();

  const pinnedData = useMemo(
    () => ({
      authors: authors.filter((a) =>
        localData.authorIDsPinned.some((id) => id === a.id),
      ),
      publications: publications.filter((p) =>
        localData.publicationIDsPinned.some((id) => id === p.id),
      ),
      resources: resources.filter((r) =>
        localData.resourceIDsPinned.some((id) => id === r.id),
      ),
    }),
    [
      localData.authorIDsPinned,
      localData.publicationIDsPinned,
      localData.resourceIDsPinned,
    ],
  );

  return (
    <>
      <div className="w-full bg-white px-2.5 py-10">
        <div className="relative mx-auto w-4/5 max-w-[1200px]">
          <BreadCrumb />
          <section className="mt-7 md:flex">
            <div className="md:flex[2_1] m-5 md:mx-2">
              <h1 className="font-yalenewroman m-0 p-0 text-xl font-normal">
                Your pinned items
              </h1>
              <p>
                These items are stored temporarily in your browser. They will
                not be saved after you close the browser window or tab.
              </p>
            </div>
            <div className="md:max-w-[350px]">
              <div className="flex justify-end">
                <BigNumber
                  className="border-[#f9be00]"
                  label={
                    pinnedData.resources.length === 1
                      ? "testimony"
                      : "testimonies"
                  }
                  value={pinnedData.resources.length}
                />
                <BigNumber
                  className="border-[#0d99aa]"
                  label={
                    pinnedData.publications.length === 1
                      ? "publication"
                      : "publications"
                  }
                  value={pinnedData.publications.length}
                />
                <BigNumber
                  className="border-[#ca6251]"
                  label={pinnedData.authors.length === 1 ? "author" : "authors"}
                  value={pinnedData.authors.length}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <ResultListWrapper>
        <ResultList items={pinnedData.resources} />
        <ResultList items={pinnedData.publications} />
        <ResultList items={pinnedData.authors} />
      </ResultListWrapper>
    </>
  );
}

import Link from "next/link";

import BigNumber from "~/components/BigNumber";
import PublicationHistogram from "~/components/PublicationHistogram";
import ResultList from "~/components/ResultList";
import ResultListWrapper from "~/components/ResultListWrapper";
import TopWrapper from "~/components/TopWrapper";
import { getResourceLink } from "~/utils/data";
import { footnotes, publications, resources } from "~/utils/data";

export async function generateStaticParams() {
  return resources.map((r) => ({
    id: r.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    return {
      title: "Resource Not Found",
    };
  }

  return {
    title: resource.name,
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: resourcesId } = await params;

  const resource = resources.find((r) => r.id === resourcesId);

  if (!resource) {
    return;
  }

  const filteredFootnotes = footnotes.filter(
    (f) => f["resource.id"] === resourcesId,
  );
  const filteredPublications = publications.filter((p) =>
    filteredFootnotes.some((f) => f["publication.id"] === p.id),
  );

  return (
    <div className="ResourcePage">
      <TopWrapper id={resourcesId} saveType="resource">
        <div className="flex w-full flex-wrap items-start justify-center gap-x-2 gap-y-2">
          <h1 className="font-yalenewroman mx-5 w-full text-2xl md:mx-2.5">
            {resource.title}
          </h1>
          <div className="mx-5 flex-1 basis-full md:mx-2.5 lg:basis-0">
            <Link
              className="group hover:shadow-yale shadow-yale/10 flex h-[30px] w-fit items-stretch overflow-hidden rounded-lg bg-white"
              href={getResourceLink(resource)}
              type="button"
            >
              <div className="flex h-full w-[10px] items-center justify-center overflow-hidden bg-[#f9be00]/50 transition-[width,background-color] group-hover:w-[60px] group-hover:bg-[#f9be00]">
                <span className="text-xs font-bold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  View
                </span>
              </div>
              <span className="flex items-center px-3 font-bold text-[#222]">
                {resource.id}
              </span>
            </Link>

            <div className="my-4">
              <p>
                This testimony has been cited{" "}
                <span className="font-bold">
                  {filteredFootnotes.length}&nbsp;
                  {filteredFootnotes.length === 1 ? "time" : "times"}
                </span>{" "}
                in the{" "}
                <span className="font-bold">
                  {filteredPublications.length}&nbsp;
                  {filteredPublications.length === 1
                    ? "publication"
                    : "publications"}
                </span>{" "}
                listed below.
              </p>
            </div>
          </div>
          {filteredPublications.length >= 2 && (
            <figure className="mx-2.5 w-[260px] flex-none">
              <PublicationHistogram items={filteredPublications} />
              <figcaption className="text-center text-xs font-bold text-[#222]">
                Publications by year
              </figcaption>
            </figure>
          )}
          <div className="mx-2.5 flex w-fit flex-none justify-center pt-8">
            <BigNumber
              className="border-[#f48734]"
              label={filteredFootnotes.length === 1 ? "citation" : "citations"}
              value={filteredFootnotes.length}
            />
            <BigNumber
              className="border-[#0d99aa]"
              label={
                filteredPublications.length === 1
                  ? "publication"
                  : "publications"
              }
              value={filteredPublications.length}
            />
          </div>
        </div>
      </TopWrapper>

      <ResultListWrapper>
        <ResultList items={filteredPublications} />
      </ResultListWrapper>
    </div>
  );
}

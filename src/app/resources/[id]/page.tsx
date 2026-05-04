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
        <div className="mx-5 md:mx-2.5 md:flex-[2_1]">
          <h1 className="font-yalenewroman text-2xl">{resource.title}</h1>
          <div className="mt-3 font-bold text-[#222]">{resource.id}</div>

          <div className="view-button-container">
            <Link
              className="hover:shadow-yale flex h-[30px] w-fit items-center justify-center rounded-lg bg-[#0d99aa] px-2.5 text-sm font-bold text-white"
              href={getResourceLink(resource)}
              type="button"
            >
              View
            </Link>
          </div>

          <div className="my-4">
            <p>
              This testimony has been cited{" "}
              <span className="font-bold">
                {filteredFootnotes.length}{" "}
                {filteredFootnotes.length === 1 ? "time" : "times"}
              </span>{" "}
              in the{" "}
              <span className="font-bold">
                {filteredPublications.length}{" "}
                {filteredPublications.length === 1
                  ? "publication"
                  : "publications"}
              </span>{" "}
              listed below.
            </p>
          </div>
        </div>
        <div className="grid justify-end gap-x-2 md:max-w-[560px] md:grid-cols-[260px_auto] md:items-center md:self-end">
          <PublicationHistogram items={filteredPublications} />
          <p className="text-center text-xs font-bold text-[#222]">
            Publications by year
          </p>
          <div className="flex md:col-start-2 md:row-start-1">
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

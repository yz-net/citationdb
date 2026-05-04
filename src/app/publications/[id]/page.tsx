import Link from "next/link";

import BigNumber from "~/components/BigNumber";
import ResultList from "~/components/ResultList";
import TopWrapper from "~/components/TopWrapper";
import ResultListWrapper from "~/components/ResultListWrapper";
import { uniqueArray } from "~/utils/array";
import { publications, authors, footnotes, resources } from "~/utils/data";

export async function generateStaticParams() {
  return publications.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publication = publications.find((p) => p.id === id);

  if (!publication) {
    return {
      title: "Publication Not Found",
    };
  }

  return {
    title: publication.name,
  };
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: publicationsId } = await params;

  const publication = publications.find((p) => p.id === publicationsId);

  const filteredAuthors = authors.filter((a) =>
    publication["author.id"].some((aid: string) => aid === a.id),
  );

  const filteredFootnotes = footnotes.filter(
    (f) => f["publication.id"] === publicationsId,
  );

  const uniqueResources = uniqueArray(
    resources.filter((r) =>
      filteredFootnotes.some((f) => f["resource.id"] === r.id),
    ),
    "id",
  );

  return (
    <>
      <TopWrapper id={publicationsId} saveType="publication">
        <div className="mx-5 md:mx-2.5 md:flex-[2_1]">
          <h1 className="font-yalenewroman text-2xl">{publication.title}</h1>
          <div>
            {filteredAuthors?.map((author: any, i: number) => (
              <span key={i}>
                <Link
                  className="font-bold text-[#222] underline hover:text-[#00356b]"
                  href={`/authors/${author.id}`}
                  type="button"
                >
                  {author.name ?? ""}
                </Link>
                {"; "}
              </span>
            ))}
            <span className="font-bold">{publication.publisher ?? ""}</span>
            <span>{publication.date ?? ""}</span>
          </div>
          {publication.uri && (
            <a
              className="text-[#222] underline hover:text-[#00356b]"
              rel="noopener noreferrer"
              target="_blank"
              href={publication.uri}
            >
              Publication page
            </a>
          )}

          <div className="my-4">
            <p>
              This publication cites{" "}
              <span className="font-bold">
                {uniqueResources.length}{" "}
                {uniqueResources.length === 1 ? "testimony" : "testimonies"}
              </span>{" "}
              in the{" "}
              <span className="font-bold">
                {filteredFootnotes.length}{" "}
                {filteredFootnotes.length === 1 ? "citation" : "citations"}
              </span>{" "}
              listed below.
            </p>
          </div>
        </div>
        <div className="md:max-w-[350px]">
          <div className="flex justify-center">
            <BigNumber
              className="border-[#f48734]"
              label="citations"
              value={filteredFootnotes.length}
            />
            <BigNumber
              className="border-[#f9be00]"
              label={uniqueResources.length === 1 ? "testimony" : "testimonies"}
              value={uniqueResources.length}
            />
          </div>
        </div>
      </TopWrapper>{" "}
      <ResultListWrapper>
        <ResultList items={filteredFootnotes} />
      </ResultListWrapper>
    </>
  );
}

import BigNumber from "~/components/BigNumber";
import ResultList from "~/components/ResultList";
import TopWrapper from "~/components/TopWrapper";
import ResultListWrapper from "~/components/ResultListWrapper";
import { uniqueArray } from "~/utils/array";
import { authors, publications, footnotes, resources } from "~/utils/data";

export async function generateStaticParams() {
  return authors.map((a) => ({
    id: a.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = authors.find((a) => a.id === id);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: author.name,
  };
}

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: authorId } = await params;

  const author = authors.find((a: any) => a.id === authorId);

  if (!author) {
    return <div>Author not found</div>;
  }

  const filteredPublications = publications.filter((p: any) =>
    p["author.id"].some((id: string) => id === authorId),
  );
  const filteredFootnotes = footnotes.filter((f: any) =>
    filteredPublications.some((p: any) => p.id === f["publication.id"]),
  );
  const uniqueResources = uniqueArray(
    resources.filter((r: any) =>
      filteredFootnotes.some((f: any) => f["resource.id"] === r.id),
    ),
    "id",
  );

  return (
    <div className="PublicationPage">
      <TopWrapper id={author.id} saveType="author">
        <div className="mx-5 md:mx-2.5 md:flex-[2_1]">
          <div>
            <h1 className="font-yalenewroman text-2xl">{author.name}</h1>
            {author.uri?.length > 0 && (
              <a
                className="text-[#286dc0] no-underline hover:text-[#00356b]"
                href={author.uri}
              >
                Author website
              </a>
            )}
            <div className="my-4">
              <p>
                This author has made{" "}
                <span className="font-bold">
                  {filteredFootnotes.length}{" "}
                  {filteredFootnotes.length === 1 ? "citation" : "citations"}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {uniqueResources.length}{" "}
                  {uniqueResources.length === 1 ? "testimony" : "testimonies"}
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
        </div>
        <div className="md:max-w-[350px]">
          <div className="flex justify-center md:justify-end">
            <BigNumber
              className="border-[#0d99aa]"
              label={
                filteredPublications.length === 1
                  ? "publication"
                  : "publications"
              }
              value={filteredPublications.length}
            />
            <BigNumber
              className="border-[#f48734]"
              label={filteredFootnotes.length === 1 ? "citation" : "citations"}
              value={filteredFootnotes.length}
            />
            <BigNumber
              className="border-[#f9be00]"
              label={uniqueResources.length === 1 ? "testimony" : "testimonies"}
              value={uniqueResources.length}
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

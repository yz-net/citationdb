"use client"; // debug

import BigNumber from "~/components/BigNumber";
import ResultList from "~/components/ResultList";
import uniqueArray from "~/data/utils/uniqueArray";
import TopWrapper from "~/components/TopWrapper";

import data from "~/data";

export default function AuthorsPage(props: any) {
  const authorId = props.params.id;

  const item = data.publication.byId(authorId);
  const author = data.author.byId(item.id);
  const publications = data.publication.byAuthor(authorId);
  const footnotes = data.footnote.byAuthor(authorId);
  const resourceCount = uniqueArray(
    data.resource.inFootnotes(footnotes).map((x: any) => x.id),
  ).length;

  return (
    <div className="PublicationPage">
      <TopWrapper id={authorId} saveType="author">
        <div className="m-5 md:mx-2.5 md:my-0 md:flex">
          <div>
            <h1 className="font-yalenewroman text-2xl">{author.name}</h1>
            {author.uri?.length > 0 && (
              <a className="text-[#286dc0] no-underline" href={author.uri}>
                Author website
              </a>
            )}
            <div className="my-4">
              <p>
                This author has made{" "}
                <span className="font-bold">
                  {footnotes.length}{" "}
                  {footnotes.length === 1 ? "citation" : "citations"}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {resourceCount}{" "}
                  {resourceCount === 1 ? "testimony" : "testimonies"}
                </span>{" "}
                in the{" "}
                <span className="font-bold">
                  {publications.length}{" "}
                  {publications.length === 1 ? "publication" : "publications"}
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
              label={publications.length === 1 ? "publication" : "publications"}
              value={publications.length}
            />
            <BigNumber
              className="border-[#f48734]"
              label={footnotes.length === 1 ? "citation" : "citations"}
              value={footnotes.length}
            />
            <BigNumber
              className="border-[#f9be00]"
              label={resourceCount === 1 ? "testimony" : "testimonies"}
              value={resourceCount}
            />
          </div>
        </div>
      </TopWrapper>
      ,
      <section className="column-wrapper">
        <ResultList items={publications} />
      </section>
    </div>
  );
}

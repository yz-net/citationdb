import BreadCrumb from "../BreadCrumb";

/**
 * Wrap a page's top matter with the navigation buttons.
 * Should this be raised up to the CitationDB index?
 * Probably. But this is to accommodate keeping the
 * nav tray inside the DOM element that contains the
 * site's top matter for style and structure purposes.
 */
export default function TopWrapper(props: {
  children: React.ReactNode;
  id: string | number | null;
  saveType: string;
}) {
  return (
    <div className="w-full bg-white px-2.5 py-10">
      <div className="relative mx-2.5 w-auto max-w-[1200px] md:mx-auto md:w-4/5">
        <BreadCrumb id={props.id} saveType={props.saveType} />
        <section className="mt-3.5 flex flex-col gap-y-2 md:flex-row md:flex-wrap">
          {props.children}
        </section>
      </div>
    </div>
  );
}

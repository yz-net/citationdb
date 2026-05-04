/* eslint-disable */
// @ts-nocheck

import authorJSON from "../../public/data/author.json" assert { type: "json" };
import footnoteJSON from "../../public/data/footnote.json" assert { type: "json" };
import publicationJSON from "../../public/data/publication.json" assert { type: "json" };
import resourceJSON from "../../public/data/resource.json" assert { type: "json" };

export const authors = Object.entries(authorJSON).map(
  ([key, value]: [string, any]) => ({
    ...value,
    id: key,
    __header: value.name,
    __type: "author",
  }),
);
export const footnotes = Object.entries(footnoteJSON).map(
  ([key, value]: [string, any]) => ({
    ...value,
    id: key,
    __header: { id: value["publication.id"] },
    __type: "footnote",
  }),
);

export const publications = Object.entries(publicationJSON).map(
  ([key, value]: [string, any]) => ({
    ...value,
    id: key,
    __header: value.title,
    __type: "publication",
  }),
);

export const resources = Object.entries(resourceJSON).map(
  ([key, value]: [string, any]) => ({
    ...value,
    id: key,
    __header: value.title,
    __type: "resource",
  }),
);

export function getRecordingYear(record: any) {
  // returns only the first recording year
  return (record.recording_dates || [])
    .filter((a: any) => a)
    .map((a: any) => Number(a.slice(0, 4)))
    .sort()[0];
}

export function yearCounts(items) {
  let ret = {};
  items.forEach((item) => {
    if (Number(item.date) && String(item.date).length === 4) {
      if (!ret[item.date]) {
        ret[item.date] = { count: 0, label: item.date };
      }
      ret[item.date].count += 1;
    }
  });
  ret = Object.keys(ret).map((k) => ret[k]);
  return ret;
}

export function countByType(items) {
  const ret = {
    publication: 0,
    footnote: 0,
    resource: 0,
    author: 0,
  };

  items.forEach((item) => {
    if (!ret[item.__type]) {
      ret[item.__type] = 0;
    }
    ret[item.__type] += 1;
  });
  return ret;
}

export function secondsToTimestamp(seconds) {
  const h = Math.floor(seconds / (60 * 60));

  let remaining = seconds - h * 60 * 60;

  const m = Math.floor(remaining / 60);

  remaining = remaining - 60 * m;

  const s = Math.floor(remaining);

  const seg = (x) => String(x).padStart(2, "0");

  return `${seg(h)}:${seg(m)}:${seg(s)}`;
}

export function getResourceLink(resource) {
  /*
   * example: https://fortunoff.aviaryplatform.com/c/mssa.hvt.0007/2/460
   */

  // drop the "HVT-" part
  const num = String(resource.id.slice(4)).padStart(4, "0");

  return `https://fortunoff.aviaryplatform.com/c/mssa.hvt.${num}`;
}

export function dictToArray(
  obj: Record<string, string | number>,
  keyField = "id",
) {
  return Object.keys(obj).map((key) => {
    const ret = {
      ...obj[key],
    };

    ret[keyField] = key;

    return ret;
  });
}

export function getFootnoteURI(footnote) {
  /*
   * example: https://fortunoff.aviaryplatform.com/c/mssa.hvt.0007/2/460
   */

  const aviary_url = "https://fortunoff.aviaryplatform.com/";

  const resourceID = footnote["resource.id"].trim();
  if (resourceID.indexOf("HVT-") < 0) {
    return aviary_url;
  }
  const mssid = "mssa.hvt." + resourceID.slice(4);

  const videoBaseURL = "https://fortunoff.aviaryplatform.com/c/" + mssid + "/";

  // if there's a full time stamp we can use that.
  if (!footnote.tape) {
    return videoBaseURL;
  }
  const tape = footnote.tape as number;
  const start_time = Math.round(footnote.start_time as number); //.trim();

  if (!tape || start_time.length < 1) {
    return videoBaseURL;
  }

  return videoBaseURL + Math.round(tape) + "/" + start_time;
}

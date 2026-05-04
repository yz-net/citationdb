/* eslint-disable */
// @ts-nocheck

require("dotenv").config();
const path = require("path");

if (process.env.AIRTABLE_TOKEN === undefined) {
  console.error("Please set the AIRTABLE_TOKEN environment variable");
  process.exit(1);
}

const Airtable = require("airtable");
const fs = require("fs-extra");

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN,
});
const base = Airtable.base("appn80Y1csBuNkzfO");

async function downloadTable(tableName) {
  const records = await base(tableName).select().all();
  let jsonRecords = records.map((record) => record.fields);
  return { tableName, records, jsonRecords };
}

const fieldMappings = {
  "author.id": "Author",
  Publication: "Publication",
  "publication.id": "Publication",
  "resource.id": "Resource",
  Footnote: "Footnote",
  Footnotes: "Footnote",
  has(obj) {
    return Object.keys(this).some((key) => Object.keys(obj).includes(key));
  },
  recordsToBeConverted(obj) {
    return Object.keys(this).filter((key) => Object.keys(obj).includes(key));
  },
};
async function downloadAllTables() {
  const tableNames = ["Resource", "Footnote", "Author", "Publication"];
  const tables = {};
  for (const tableName of tableNames) {
    tables[tableName] = await downloadTable(tableName);
  }

  for (let tableName in tables) {
    const table = tables[tableName];
    table.jsonRecords = table.jsonRecords.map((record) => {
      if (fieldMappings.has(record)) {
        fieldMappings.recordsToBeConverted(record).forEach((key) => {
          record[key] = record[key].map((id) => {
            return [...tables[fieldMappings[key]].records].find(
              (r) => r.id === id,
            ).fields.id;
          });
        });
      }
      return record;
    });

    fs.ensureDirSync(path.resolve(__dirname, `../airtable`));
    fs.writeFileSync(
      path.resolve(__dirname, `./${tableName.toLowerCase()}.json`),
      JSON.stringify(table.jsonRecords, null, 2),
    );
  }
}

downloadAllTables();

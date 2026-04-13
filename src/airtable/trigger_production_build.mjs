import { config } from 'dotenv';
config();

const github_pat = process.env.GITHUB_CITATIONDB_PAT;
if (!github_pat) {
  console.error('GITHUB_CITATIONDB_PAT not found in .env');
  process.exit(1);
}

let res = await fetch('https://api.github.com/repos/yale-fortunoff/citationdb/actions/workflows');
let { workflows } = await res.json();
const workflow = workflows.find(w => w.path.indexOf('build-from-airtable') > -1);

console.log('Found workflow:', workflow.id, workflow.name);

const dispatchRes = await fetch(`https://api.github.com/repos/yale-fortunoff/citationdb/actions/workflows/${workflow.id}/dispatches`, {
  method: 'POST',
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${github_pat}`,
    'X-GitHub-Api-Version': '2026-03-10',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "ref": "main"
  })
});

console.log('Status:', dispatchRes.status, dispatchRes.statusText);
if (dispatchRes.status !== 204) {
  const body = await dispatchRes.text();
  console.log('Response:', body);
}

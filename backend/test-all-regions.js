// test-all-regions.js
const { Client } = require('pg');

const regions = [
  'ap-south-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'ap-southeast-1', 'ap-southeast-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2',
  'sa-east-1', 'ca-central-1'
];

async function test() {
  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.xwmxvrwvbtijclvqronc:Jungkook%401997@${host}:5432/postgres`;
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    
    try {
      await client.connect();
      console.log(`🎉 SUCCESS: Connected to region ${reg}!`);
      await client.end();
      process.exit(0);
    } catch (err) {
      if (err.message.includes('password authentication failed') || err.message.includes('auth')) {
        console.log(`🔐 SUCCESS: Reached database in region ${reg} (auth error: ${err.message.trim()})`);
        process.exit(0);
      } else {
        console.log(`❌ Failed on ${reg}: ${err.message.trim()}`);
      }
    }
  }
  console.log("None of the tested regions succeeded.");
}

test();

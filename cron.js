const awesome = require("awesome_starter");
const cron = require("node-cron");
const { getMissedBlocksCron } = require("./lib/getwitness");
const { getNodesInfoCron } = require("./lib/nodesinfo");

cron.schedule("* * * * *", () => {
  getMissedBlocksCron().catch(e =>
    awesome.errors.generalCatchCallback(e, "[cron]getMissedBlocksCron")
  );
});

cron.schedule("* * * * *", () => {
  getNodesInfoCron().catch(e =>
    awesome.errors.generalCatchCallback(e, "[cron]getNodesInfoCron")
  );
});

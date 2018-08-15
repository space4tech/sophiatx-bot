// replace all the fields with your configuration

exports.telegramAPIToken = ""; // Your telegram bot API key.
exports.chatId = ""; // your telegram id.
exports.APINodeURL = "https://sophiatx-api.spacemx.tech"; //api node to execute querys

exports.witness_account = ""; //your witness account

exports.remoteNodes = [
  //list of your API nodes
  //You need 2 or more in order to this function to work
  {
    //url is your webserver-http-endpoint
    url: "http://127.0.0.1:9193",
    name: "Local API"
  },
  {
    url: "https://sophiatx-api.spacemx.tech",
    name: "Remote API 1"
  }
];

const awesome = require("awesome_starter");
const axios = require("axios");
const request  = require("request");
const settings = require("../config");
const { bot } = require("./telegram");
var requestData;

function get_dynamic_global_properties(){
  requestData = {"jsonrpc": "2.0", "method": "database_api.get_dynamic_global_properties", "params": {}, "id": 1}
  request({
        url : settings.APINodeURL,
        method: "POST",
        json : requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
	  var i_current_supply = body.result.current_supply.replace(' SPHTX','') * 1;
	  var i_total_vesting_shares = body.result.total_vesting_shares.replace(' VESTS','') * 1;
	  var i_percent_vesting = (i_total_vesting_shares / i_current_supply) * 100;
	  var i_total_irrv = body.result.head_block_number - body.result.last_irreversible_block_num
	  i_current_supply = i_current_supply.toFixed(2);
	  i_total_vesting_shares = i_total_vesting_shares.toFixed(2);
          
          bot.sendMessage(
            settings.chatId,
            `<b>Current block</b> : ` + body.result.head_block_number +
            `\n<b>Last irreversible block</b>: ` + body.result.last_irreversible_block_num + " ["+i_total_irrv+"]"+
            `\n<b>Current supply</b>: ` + i_current_supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            `\n<b>Total vesting shares</b>: ` + i_total_vesting_shares.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
            `\n<b>% in vesting shares</b>: `  + i_percent_vesting.toFixed(2) + "%",
            { parse_mode: "HTML" }
          );
          console.log(`<b>Current block</b>: ` + body.result.head_block_number);
          return body;
        }
        else {
          bot.sendMessage(
            settings.chatId,
            `Error trying to execute get_dynamic_global_properties function. Error: `+ error +` ::: Response:  `+ response,
            { parse_mode: "HTML" }
          );
            console.log("error: " + error)
            console.log("response.statusCode: " + response);
        }
    });
}

function get_active_witnesses(){
  requestData = {"jsonrpc": "2.0", "method": "database_api.get_active_witnesses", "params": {}, "id":1}
  request({
        url : settings.APINodeURL,
        method: "POST",
        json : requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
	    var i_count = 0;
	    var fullMessage="<b>Active witnesses:</b>\n"
            for(let i = 0, len = body.result.witnesses.length; i < len; i++){
		if(body.result.witnesses[i] != ""){
			i_count++;
			if(settings.witness_account === body.result.witnesses[i]){
				fullMessage += "<b>"+ body.result.witnesses[i] +"</b>, ";
			}else{
			  fullMessage += body.result.witnesses[i] + ", ";
			}
		}
            }
	   fullMessage +=" <b>total = "+ i_count + "</b>";
          bot.sendMessage(
            settings.chatId,
            fullMessage,
            { parse_mode: "HTML" }
          );
          console.log(fullMessage);
          return body;
        }
        else {
          bot.sendMessage(
            settings.chatId,
            `Error trying to execute get_active_witnesses function. Error: `+ error +` ::: Response:  `+ response,
            { parse_mode: "HTML" }
          );
            console.log("error: " + error)
            console.log("response.statusCode: " + response);
        }
    });
}

const respondBlockchainInfo = async () => {
  //get_dynamic_global_properties ::: return: head_block_num, current_supply, total_vesting_shares, % of vesting shares, last_irreversible_block_num
  //get_active_witnesses :::: return: result.active_witnesses
  try {
    var infoData1 = await get_dynamic_global_properties();
    var infoData2 = get_active_witnesses();
  } catch (error) {
    bot.sendMessage(
      settings.chatId,
      `Error in respondBlockchainInfo: `+ error,
      { parse_mode: "HTML" }
    );
  }
};

exports.respondBlockchainInfo = respondBlockchainInfo;

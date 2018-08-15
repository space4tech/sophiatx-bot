const awesome = require("awesome_starter");
const axios = require("axios");
const request  = require("request");
const settings = require("../config");
const { bot } = require("./telegram");
var requestData;
var actualMissedBlocks = require("../index").actualMissedBlocks;
    
function get_vesting_balances(){
  requestData = {"jsonrpc": "2.0", "method": "database_api.find_accounts", "params": {"accounts": [settings.witness_account]}, "id":1}
  let options = {
        url: settings.APINodeURL,
        method: "POST",
        json : requestData
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })  
}

function get_witness(){
  requestData = {"jsonrpc": "2.0", "method": "database_api.find_witnesses", "params": {"owners": [settings.witness_account]}, "id":1}
  let options = {
        url: settings.APINodeURL,
        method: "POST",
        json : requestData
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })  
}

const respondGetWitness = async () => {
  //return total_votes, total_missed, last_confirmed_block_num, running_version
  //get_vesting_balances ::: return: balance, vesting_shares
        let getData = get_witness();
        getData.then(function(result) {
            data = result;
	   var i_votes = Math.round(data.result.witnesses[0].votes) / 1000000;
	   i_votes = i_votes.toFixed(2);
            bot.sendMessage(
              settings.chatId,
              `<b>Total in votes</b>: ` + i_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `\n<b>Total missed</b>: ` + 
              data.result.witnesses[0].total_missed + `\n<b>Last signed block</b>: ` + 
              data.result.witnesses[0].last_confirmed_block_num+ `\n<b>Running version</b>: ` + data.result.witnesses[0].running_version,
              { parse_mode: "HTML" }
            );
        }, function(err) {
            bot.sendMessage(
              settings.chatId,
              `Error trying respondGetWitness get_witness: `+ err,
              { parse_mode: "HTML" }
            );
            console.log(err);
        });
    
       let getData2 = get_vesting_balances();
        getData2.then(function(result) {
            data = result;
          var i_balance = data.result.accounts[0].balance.replace(' SPHTX','') * 1;
          var i_vesting_shares = data.result.accounts[0].vesting_shares.replace(' VESTS','') * 1;
	  
          i_balance = i_balance.toFixed(2);
	  i_vesting_shares = i_vesting_shares;
          i_vesting_shares = i_vesting_shares.toFixed(2);

            bot.sendMessage(
              settings.chatId,
              `<b>Balance</b>: ` + i_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+
	      `\n<b>Vesting shares:</b> `+ i_vesting_shares.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              { parse_mode: "HTML" }
            );
        }, function(err) {
            bot.sendMessage(
              settings.chatId,
              `Error trying respondGetWitness get_vesting_balances: `+ err,
              { parse_mode: "HTML" }
            );
            console.log(err);
        });
};

const getMissedBlocks = async () => {
    let getData = get_witness();
    getData.then(function(result) {
        let data = result;
        result (data.result.witnesses[0].total_missed);
    }, function(err) {
        bot.sendMessage(
          settings.chatId,
          `Error trying Missedblocks: `+ err,
          { parse_mode: "HTML" }
        );
        console.log(err);
    });
};

const getMissedBlocksCron = async () => {
    let getData = get_witness();
    getData.then(function(result) {
        let data = result;
        if(actualMissedBlocks == undefined){
          actualMissedBlocks = data.result.witnesses[0].total_missed;
        }
        if(actualMissedBlocks != data.result.witnesses[0].total_missed){
          bot.sendMessage(
            settings.chatId,
            `You are missing blocks\nActual missed blocks: `+ data.result.witnesses[0].total_missed,
            { parse_mode: "HTML" }
          );
          actualMissedBlocks = data.result.witnesses[0].total_missed;
        }
    }, function(err) {
        bot.sendMessage(
          settings.chatId,
          `Error trying Missedblocks cron: `+ err,
          { parse_mode: "HTML" }
        );
        console.log(err);
    })
};

exports.respondGetWitness = respondGetWitness;
exports.getMissedBlocks = getMissedBlocks;
exports.getMissedBlocksCron = getMissedBlocksCron;

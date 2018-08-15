const awesome = require("awesome_starter");
const axios = require("axios");
const request  = require("request-promise");
const settings = require("../config");
const { bot } = require("./telegram");

var getInfo = function get(nodeURL){
  let requestData = {"jsonrpc": "2.0", "method": "database_api.get_dynamic_global_properties", "params": {}, "id":1}
  let options = {
        url: nodeURL.url,
        method: "POST",
        json : requestData
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                let n = Object.assign({}, body);
                n.name = nodeURL.name;
                resolve(n);
            }
        })
        .catch(function(err){ 
            reject(JSON.stringify(err));
        });
    })    
}

const getNodesInfo = async () => {
  let nodesInSync = 0;
  let noError = true;
  let firstNodeHeight = 0;
  let fullMessage = settings.remoteNodes.length + " Api nodes to watch:\n";
  let actions = settings.remoteNodes.map(getInfo);
    let results = Promise.all(actions)
    .catch(function(err) {
        console.log("Error 1: "+ JSON.stringify(err));
        noError = false;
        bot.sendMessage(
          settings.chatId,
          "Node "+ err.address + " port "+ err.port +" can't be reached",
          { parse_mode: "HTML" }
        )
      
        fullMessage += "Error couldn't reach node:"+ err.address +" port: "+ err.port;
        return actions;
    })
    .then(data => {
      try{
        console.log("JSON datos: "+ JSON.stringify(data));
        console.log("No error = "+ noError);
          if(noError){
            for(let i = 0, len = data.length; i < len; i++){
                fullMessage +=data[i].result.head_block_number +" :: <b>"+ data[i].name +"</b>\n";
                if(firstNodeHeight === 0)
                   firstNodeHeight = data[i].result.head_block_number;

                let zero = firstNodeHeight - data[i].result.head_block_number;
                if (zero >= -3 && zero <= 3)
                  nodesInSync++;
            }

            if(nodesInSync === settings.remoteNodes.length)
                fullMessage +="✅ All your api nodes are in sync";
            else
                fullMessage +="⚠️ One of your api nodes are out of sync";

            bot.sendMessage(
              settings.chatId,
              fullMessage,
              { parse_mode: "HTML" }
            )
        }else{
            bot.sendMessage(
              settings.chatId,
              "⚠️ Error please take manual action",
              { parse_mode: "HTML" }
            )
        }
      }catch(err){
        bot.sendMessage(
          settings.chatId,
          `Error : `+ err,
          { parse_mode: "HTML" }
        )
      }

    })
    .catch(err => {
      bot.sendMessage(
        settings.chatId,
        `Error in getNodesInfo: `+ err,
        { parse_mode: "HTML" }
      )
    })
};

const getNodesInfoCron = async () => {
  let nodesInSync = 0;
  let noError = true;
  let firstNodeHeight = 0;
  let fullMessage = "-------------------------\n";
  fullMessage += settings.remoteNodes.length + " Api nodes to watch:\n";
  let actions = settings.remoteNodes.map(getInfo);
    let results = Promise.all(actions)
    .catch(function(err) {
        console.log("Error 1: "+ JSON.stringify(err));
        noError = false;
        bot.sendMessage(
          settings.chatId,
          "Node "+ err.address + " port "+ err.port +" can't be reached",
          { parse_mode: "HTML" }
        )
      
        fullMessage += "Error couldn't reach node:"+ err.address +" port: "+ err.port;
        return actions;
    })
    .then(data => {
        console.log("Cron JSON datos: "+ JSON.stringify(data));
        console.log("Cron No error = "+ noError);
      if(noError){
          for(let i = 0, len = data.length; i < len; i++){
              fullMessage +=data[i].result.head_block_number +" :: <b>"+ data[i].name +"</b>\n";
              if(firstNodeHeight === 0)
                 firstNodeHeight = data[i].result.head_block_number;

              let zero = firstNodeHeight - data[i].result.head_block_number;
              if (zero >= -3 && zero <= 3)
                nodesInSync++;
          }

          if(nodesInSync < settings.remoteNodes.length){
              fullMessage +="⚠️ One of your api nodes are out of sync";
              bot.sendMessage(
                settings.chatId,
                fullMessage,
                { parse_mode: "HTML" }
              )
          }
        }else{
            bot.sendMessage(
              settings.chatId,
              "⚠️ Error please take manual action",
              { parse_mode: "HTML" }
            )
        }
      console.log("Cron EndMessage = "+ fullMessage);
    })
    .catch(err => {
      bot.sendMessage(
        settings.chatId,
        `Error in getNodesInfo: `+ err,
        { parse_mode: "HTML" }
      )
    })
};

exports.getNodesInfo = getNodesInfo;
exports.getNodesInfoCron = getNodesInfoCron;

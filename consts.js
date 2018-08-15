exports.menu = {
  reply_markup: {
    keyboard: [
      ["🔎 Blockchain info", //return head_block_num, current_supply, total_vesting_shares, % of vesting shares, last_irreversible_block_num
       "📄 Get witness"], //return 
      ["🔎 Nodes info"] //return the block height of all nodes configured in exports.remoteNodes (config.ini)
    ]
  }
};

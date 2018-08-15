# sophiatx-bot
Telegram bot to manage SophiaTX witness nodes

This bot intent to provide remote assistant to the owner of the nodes without the need of login into console.
This software was created and tested over Ubuntu 16.x environment.


### List of things you can do
- Check the node health by comparing block height against other nodes
- Check information of the Sophiatx blockchain
- View your balance, vesting shares and total missed blocks


# Pre-requisites
### Telegram API key
First you need to create a bot in Telegram with which this software will communicate, this are the steps:
- Go to your telegram and search for @BotFather
- Open a conversation with @BotFather and send him a message like this: `/newbot`
- It will ask you for the name and username for your bot, username should end with the word `bot`. For example (in this case), name: `Sophiatx bot`, username: `sophiatx_bot`.
- As soon as you answer the questions it will give you your API key of your bot, we will use this api key later.
### Plugins and configuration required in your Sophiatx nodes
In order the bot can comunicate to your nodes you need to have the plugin `database_api` enabled in your `witness_node_data_dir/config.ini` file. Also you need `webserver-http-endpoint`, make sure which port are you using, if you want to test execute the following code in the console: `curl -s --data '{"jsonrpc": "2.0", "method": "database_api.get_dynamic_global_properties", "params": {}, "id":1}' http://127.0.0.1:9193` if you see a resulting json with blocks information it means that everything is fine and you can continue.


## Dependencies
This software uses `Git` to clone this github repository and NodeJS to perform the automatic tasks.
- To install Git use the folowing line: `sudo apt-get install git`
- To install NodeJS we will use NVM with this line: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
- At the end of NVM installation you will see the following lines to make NVM available:
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
- Finally install NodeJS running: `nvm install v8.9.4`


# Installation
- Inside your node server clone this repository: `git clone https://github.com/space4tech/sophiatx-bot`
- Go to the folder spphiatx-bot: `cd sophiatx-bot`
- Install node packages included in this software: `npm install`

## Configure and execute the bot
- Inside `sophiatx-bot/` folder you will find a file called `config.js`, there you will need to add `telegramAPIToken` and the information of your servers first. Close and save the file.
- Now execute the bot with: `npm start` and then go to your telegram and add your bot and press button start.
- In telegram, bot will send you your id which is the variable chatId in `config.js`, go to your config file and add it.
- After you added your chatId stop the bot with `npm stop` and start it again with `npm start`.
- If you see in telegram that bot send you a message it means that the installation has been successful.

## Buttons
- Blockchain info: return the current information of Sophiatx blockchain. Data: current block, last irreversible block, current supply, total vesting shares, % in vesting shares and active witnesses.
- Get witness: return the current information of the witness account configured in config.js file. Data: total in votes, total missed, last signed block, running version, balance and vesting shars.
- Nodes info: return the current block of all of the nodes configured in config.js file.
![image](https://raw.githubusercontent.com/space4tech/sophiatx-bot/master/img/button_blockchain_info.png)
![image](https://raw.githubusercontent.com/space4tech/sophiatx-bot/master/img/button_nodes_info.png)


## Cronjob
Sophiatx-bot runs 2 cronjobs
- Block height: this cronjob will watch the health of the nodes configured in config.js file, if one of the nodes is stuck in a specific block or doesn't respond the bot will send a message every minute.
- Missed blocks: this cronjob will watch the total missed blocks and if the witness start to miss more blocks the bot will send message of alert every minute.


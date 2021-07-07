const fs = require('fs')
const tmi = require('tmi.js');
const { HandCashConnect } = require('@handcash/handcash-connect');

const logger = fs.createWriteStream('payments-log.txt', {
   flags: 'a'
});
const handcashAppId = '6079dab2d81fa20bfe1318f9';
const handCashConnect = new HandCashConnect(handcashAppId);
const handcashAuthToken = process.env.HANDCASH_AUTH_TOKEN;
const twitchAuthToken = process.env.TWITCH_AUTH_TOKEN;
if (!handcashAuthToken) {
   console.log('Get your HandCash authToken here: ' + handCashConnect.getRedirectionUrl());
   return;
}
const channelName = process.env.CHANNEL_NAME;
const durosAmountPerGiveaway = 5;
const alreadyPaidHandles = new Set();

(async () => {
   const account = handCashConnect.getAccountFromAuthToken(handcashAuthToken);
   const publicProfile = await account.profile.getCurrentProfile();
   console.log(`Logged as $${publicProfile.publicProfile.handle}`)

   const balance = await account.wallet.getSpendableBalance();
   console.log(`Đuro Balance: ${Math.floor(balance.spendableSatoshiBalance / 500)}Đ`)

   const tmiSettings = {
         identity: {
            username: process.env.BOT_USERNAME,
            password: twitchAuthToken,
         },
         channels: [channelName]
      }
   ;

   const client = new tmi.client(tmiSettings);

   client.on('message', onMessageHandler);
   client.on('connected', onConnectedHandler);

   function onConnectedHandler(addr, port) {
      console.log(`* Connected to ${addr}:${port}`);
      client.say(`#${channelName}`, 'Starting another give away of Duros! Type in your HandCash handle: $duroBot!');
   }

   async function onMessageHandler(target, context, msg, self) {
      if (self) {
         return;
      } // Ignore messages from the bot

      const arguments = msg.trim().split(' ');
      if (arguments.length === 1 && arguments[0].startsWith('$')) {
         const handle = arguments[0].substring(1);
         if (alreadyPaidHandles.has(handle)) {
            client.say(target, `$${handle} I'm not giving you Đuros again 🤪`);
         } else {
            account.wallet.pay({
               description: 'Welcome to my channel!',
               payments: [
                  { destination: handle, currencyCode: 'DUR', sendAmount: durosAmountPerGiveaway },
               ],
            }).then((result) => {
               alreadyPaidHandles.add(handle);
               client.say(target, `Sent ${durosAmountPerGiveaway} duros to $${handle}!`);
               logger.write(JSON.stringify(result) + '\n');
            }).catch((error) => console.error(error));
         }
      }
   }

   await client.connect();
})();

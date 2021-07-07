# twitch_duro_faucet
Send a few Đuros to your viewers in Twitch! This project is inspired on the Twitch Dev documentation: https://dev.twitch.tv/docs/irc

## Getting started

### 1. Set up the environment variables:
- `HANDCASH_AUTH_TOKEN`: The auth token to get access to the HandCash account that will send the Đuros. Generate this with https://app.handcash.io/#/authorizeApp?appId=6079dab2d81fa20bfe1318f9.
- `TWITCH_AUTH_TOKEN`: The token to authenticate your chatbot with Twitch's servers. Generate this with https://twitchapps.com/tmi/ (a Twitch community-driven wrapper around the Twitch API), while logged in to your chatbot account. The token will be an alphanumeric string.
- `CHANNEL_NAME`: The Twitch channel name where you want to run the bot
- `BOT_USERNAME`: The account (username) that the chatbot uses to send chat messages. This can be your Twitch account. Alternately, many developers choose to create a second Twitch account for their bot, so it's clear from whom the messages originate.  

### 2. Initialize the chatbot

```
npm run index
```
From now on the bot will send 5 Đuros to any HandCash handle posted in the comments with the format `$myhandle`

### 3. Logging and monitoring
The bot prints in the console a message for every giveaway as well as for every error. 

Additionally, the payment results that contain every detail are stored in a file `payments-log.txt`

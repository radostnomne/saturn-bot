# daily-telegram-bot
Telegram bot who daily send weather and one word on english 

# How to run bot local:
 - go to telegram and find @BotFather
 - create new bot and get TOKEN
 - create .env file
 - copy TOKEN from BotFather and paste to .env variable `TOKEN`
 - run: `npm i -g ngrok`
 - run: `ngrok http 5000`
 - copy https url from ngrok console output and paste to .env variable `SERVER_URL`
 - run: `npm run dev`
 - write to your bot in direct message
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv';
import nodeCron from 'node-cron';
import { botIsWorksForChat } from './helpers.js';

dotenv.config()
const { TOKEN } = process.env;
const bot = new TelegramBot(TOKEN, {polling: true});

const chats = [];

bot.onText(/\/start/, (msg) => {
    if (!botIsWorksForChat(chats, msg.chat.id)) {
        chats.push(msg.chat.id)
        bot.sendMessage(msg.chat.id, "I'm showing weather and word for you every day at 9 AM")
    } else {
        bot.sendMessage(msg.chat.id, 'I already work for you!')
    }
})

bot.onText(/\/stop/, (msg) => {
    chats.splice(chats.findIndex(chatID => chatID === msg.chat.id), 1)
    bot.sendMessage(msg.chat.id, 'We stopped bot for you')
})


nodeCron.schedule('5 * * * * *', () => {
    chats.forEach(chat => (bot.sendMessage(chat, 'DAILY WEATHER AND WORD')))
})

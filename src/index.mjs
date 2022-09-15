import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3'
import nodeCron from 'node-cron';
import { botIsWorksForChat } from './helpers.js';

dotenv.config()
const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Chats (id INTEGER PRIMARY KEY, chatId TEXT)");
    db.each("SELECT id, chatId FROM Chats", function(err, row) {
        console.log(row.id + ": " + row.chatId);
    });
});

const bot = new TelegramBot(process.env.TOKEN, {polling: true});

const chats = [];

bot.onText(/\/start/, (msg) => {
    if (!botIsWorksForChat(chats, msg.chat.id)) {
        // Insert data into the table
        db.run(`INSERT INTO Chats (chatId) VALUES (${msg.chat.id})`); // TODO: add  WHERE NOT EXISTS(WHERE chatId = "${msg.chat.id})
        bot.sendMessage(msg.chat.id, "I'm showing weather and word for you every day at 9 AM")
    } else {
        bot.sendMessage(msg.chat.id, 'I already work for you!')
    }
})

bot.onText(/\/stop/, (msg) => {
    db.run(`DELETE FROM Chats WHERE chatId = "${msg.chat.id}";`)
    bot.sendMessage(msg.chat.id, 'We stopped bot for you')
})


nodeCron.schedule('5 * * * * *', () => {
    db.each("SELECT id, chatId FROM Chats", (err, row) => {
        bot.sendMessage(row.chatId, 'DAILY WEATHER AND WORD')
        console.log(row.id + ": " + row.chatId);
    });
})

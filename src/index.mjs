import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import nodeCron from "node-cron";
import { botIsWorksForChat } from "./helpers/index.mjs";
import { getRandomWord } from './services/word.service.mjs';
import { getWeather } from './services/weather.service.mjs';

dotenv.config();
const db = new sqlite3.Database("database.db");

const chats = [];

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS Chats (id INTEGER PRIMARY KEY, chatId TEXT)"
  );
  db.each("SELECT id, chatId FROM Chats", function (err, row) {
    console.log(row.id + ": " + row.chatId);
    chats.push(row.chatId);
  });
});

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const { id: chatId } = msg.chat;
  if (!botIsWorksForChat(chats, chatId)) {
    // Insert data into the table
    db.run(`INSERT INTO Chats (chatId) VALUES (${msg.chat.id})`); // TODO: add  WHERE NOT EXISTS(WHERE chatId = "${msg.chat.id})
    const { en, by, ru, pl } = await getRandomWord();
    const weather = await getWeather();
    const message = `🇷🇺Слово дня: ${ru}\n🏴󠁧󠁢󠁥󠁮󠁧󠁿English: ${en}\n🇵🇱Polish: ${pl}\n🇧🇾Беларускі: ${by}\n\n\n${weather}`;
    bot.sendMessage(
      msg.chat.id,
      message
    );
    // bot.sendMessage(
    //   msg.chat.id,
    //   "I'm showing weather and word for you every day at 9 AM"
    // );
  } else {
    bot.sendMessage(msg.chat.id, "I already work for you!");
  }
});

bot.onText(/\/stop/, (msg) => {
  db.run(`DELETE FROM Chats WHERE chatId = "${msg.chat.id}";`);
  bot.sendMessage(msg.chat.id, "We stopped bot for you");
});

nodeCron.schedule("5 * * * * *", async () => {
  const { en, by, ru, pl } = await getRandomWord();
  const weather = await getWeather();
  const message = `🇷🇺Слово дня: ${ru}\n🏴󠁧󠁢󠁥󠁮󠁧󠁿English: ${en}\n🇵🇱Polish: ${pl}\n🇧🇾Беларускі: ${by}\n\n\n${weather}`;
  db.each("SELECT id, chatId FROM Chats", (err, row) => {
    bot.sendMessage(row.chatId, message);
  });
});

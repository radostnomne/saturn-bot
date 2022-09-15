import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import nodeCron from 'node-cron';
import got from 'got';

dotenv.config()

const { TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express()
app.use(bodyParser.json())
let existCronTask;

const init = async () => {
    const res = await got.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`).json();
    console.log(res);
}

app.post(URI, async (req, res) => {
    console.log(req.body);

    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;
    if (text === '/start' && !existCronTask) {
        existCronTask = nodeCron.schedule('5 * * * * *', async () => {
            // This job will run every minute
            await got.post(`${TELEGRAM_API}/sendMessage`, {
                json: {
                    chat_id: chatId,
                    text: 'YOU CAN PUT YOUR INFO HERE'
                }
            });
            console.log(new Date().toLocaleTimeString());
        });
    }

    return res.send();
})

app.listen(process.env.PORT || 5000, async () => {
    await init();
    console.log('app running on port', process.env.PORT || 5000);
})
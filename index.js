const TelegramApi = require('node-telegram-bot-api');
const fs = require("fs");
const { TelegramLogger } = require('node-telegram-log');

require('dotenv').config()

const token = process.env.TOKEN;
const logger = new TelegramLogger(token, process.env.CHAT_ID);


const bot = new TelegramApi(token, {polling: true});

const file_new = fs.readFileSync("list.txt", "utf8");
const arr = file_new.split(/\r?\n/);

bot.on('message', msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start'){
        bot.sendMessage(chatId, 'СПИСОК ВЗЯТЫЙ ИЗ ИНТЕРНЕТА (может быть фейк)!');
        bot.sendMessage(chatId, 'Пример ответа: ВАУЧСКИЙ ПАВЕЛ ИГОРЕВИЧ 19.5.1991 КРАЙ КРАСНОДАРСКИЙ, Г. СОЧИ, Р-Н ЦЕНТРАЛЬНЫЙ, УЛ. ГОРЬКОГО, ДОМ 56 4511231237 ОТДЕЛ УФМС РОССИИ ПО ГОР. МОСКВЕ ПО РАЙОНУ МОЖАЙСКИЙ');
        bot.sendMessage(chatId, 'Вы можете искать по ФИО, Паспорту или любой информации из строки выше');

    }else{
        logger.log('search = ', text);
        const test = /[а-яё0-9]/i;
        if (!test.test(text)){
            bot.sendMessage(chatId, 'Вы ввели что-то странное.');
        }else{
            const regExp = new RegExp(text.trim(), 'gi');
            const result = arr.filter((line)=> {
                if(regExp.test(line)){
                    return true;
                }
                return false;
            });

            if (result.length > 100) {
                bot.sendMessage(chatId, 'Ответ очень большой, уточните ваш запрос');
            }else {
                if (result.length != 0){
                    bot.sendMessage(chatId, 'Пытаемся что-то найти....');
                    let res = '';
                    let count = 0;
                    for(let i = 0; i < result.length; i++ ){
                        count++;
                        res += result[i] + '\n --- \n';
                        if(count === 20 || i === result.length - 1){
                            bot.sendMessage(chatId, res);
                            res = '';
                            count = 0;
                        }
                    }
                }else {
                    bot.sendMessage(chatId, 'Ничего не найдено');
                }
            }
            bot.sendMessage(chatId, 'Чат помощи по мобилизации: @mobilizatia_poravalit');
        }
    }
})
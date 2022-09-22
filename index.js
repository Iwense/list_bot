const TelegramApi = require('node-telegram-bot-api');
const fs = require("fs");
require('dotenv').config()

const token = process.env.TOKEN;


const bot = new TelegramApi(token, {polling: true});

// const file = (term) => findInFiles.find({'term': term, 'flags': 'ig'}, '.', '.txt$')
//     .then(function(results) {
//         let res =  '';
//         for (let result in results) {
//             res = results[result].line;
//         }
//         return res;
//     });

const file_new = fs.readFileSync("list.txt", "utf8");
const arr = file_new.split(/\r?\n/);

bot.on('message', msg => {
    const text = msg.text;
    const chatId = msg.chat.id;


    if(text === '/start'){
        bot.sendMessage(chatId, 'Напиши свое ФИО, мы попробуем найти тебя в списках');
        bot.sendMessage(chatId, 'СПИСОК ВЗЯТЫЙ ИЗ ИНТЕРНЕТА (может быть фейк)!');
    }else{
        bot.sendMessage(chatId, 'Пытаемся что-то найти....');
        bot.sendMessage(chatId, 'СПИСОК ВЗЯТЫЙ ИЗ ИНТЕРНЕТА (может быть фейк)!');
        const regExp = new RegExp(text, 'gi');
        const result = arr.map((line)=> {
            if(line.includes(regExp)){
                return line
            }
        });

        if (result && result.length){
            result.forEach(text => bot.sendMessage(chatId, text))
        }else {
            bot.sendMessage(chatId, 'Ничего не найдено');
        }
        
        // file(text).then((res) => {
        //     console.log('res ', res)
        //     if (res && res.length){
        //         for(let i=0; i < res.length; i++){
        //             bot.sendMessage(chatId, res[i]);
        //         }
        //     }else {
        //         bot.sendMessage(chatId, 'Ничего не найдено');
        //     }
            
        // });
    }
})
const TelegramBot = require("node-telegram-bot-api");
const config = require('./scr/config');
const helper = require('./scr/helper');
const kb = require('./scr/keyboard-buttons');
const keyboard = require('./scr/keyboard');
let chatID;
let currency;
const TOKEN = config.TOKEN;
const bot = new TelegramBot(TOKEN || process.env.TOKEN, {
    polling: true
})
bot.on ('message', msg => {

    chatID = helper.getChatId(msg);
    switch (msg.text) {
        // Обработка события вернуться назад
        case kb.back: {
            console.log('User want to back')
            const textChoice = `Выберете валюту`;
            bot.sendMessage(chatID, textChoice, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            });
        }
            break

        case kb.home.euro: {
            console.log('User choose eur');
            currency = 'eur';
            helper.listOfBank(currency).then(list=> {
                listOfBank = list.slice();
                listOfBank = helper.getTopBanks(listOfBank);
                const listHtml = helper.getEuroList(listOfBank);
                console.log('I will show top banks with eur');
                bot.sendMessage(chatID,listHtml,{
                    parse_mode: 'HTML',
                    reply_markup: {keyboard: keyboard.afterTop}
                })

            })
        }
        break

        case kb.home.usd: {
            console.log('User choose usd');
            currency = 'usd';
            helper.listOfBank(currency).then(list=> {
                listOfBank = list.slice();
                listOfBank = helper.getTopBanks(listOfBank);
                const listHtml = helper.getEuroList(listOfBank);
                console.log('I will show top banks with usd');
                bot.sendMessage(chatID,listHtml,{
                    parse_mode: 'HTML',
                    reply_markup: {keyboard: keyboard.afterTop}
                })

            })
        }
        break
        case kb.afterTop.all:{
            console.log('User want to see list of all banks');
            helper.listOfBank(currency).then(list=> {
                listOfBank = list.slice();
                const listHtml = helper.getEuroList(listOfBank);
                console.log('I will show top banks with usd');
                bot.sendMessage(chatID,listHtml,{
                    parse_mode: 'HTML',
                    reply_markup: {keyboard: keyboard.home}
                })

            })
        }

    }
})
bot.onText(/\/start/, msg => {
    const textHello =  `Здравствуйте, ${msg.from.first_name}`;
    bot.sendMessage(chatID,textHello);
    const textChoice = `Выберете валюту`;
    bot.sendMessage(chatID,textChoice, {
        reply_markup:{
            keyboard: keyboard.home
        }
    });
})




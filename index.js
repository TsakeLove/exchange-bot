const TelegramBot = require("node-telegram-bot-api");
const config = require('./src/config');
const helper = require('./src/helper');
const kb = require('./src/keyboard-buttons');
const keyboard = require('./src/keyboard');
let chatID;
let currency;
const TOKEN = config.TOKEN;
const bot = new TelegramBot(TOKEN || process.env.TOKEN, {
    polling: true
})
//====================================
let answerCallbacks = {};


bot.on ('message', msg => {
   console.log(msg);
    //====================================
    var callback = answerCallbacks[msg.chat.id];
    if (callback) {
        delete answerCallbacks[msg.chat.id];
        return callback(msg);
    }
    //====================================
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
                const listHtml = helper.getHTML(listOfBank);
                console.log('I will show top banks with eur');
                bot.sendMessage(chatID,listHtml,{
                    parse_mode: 'HTML',
                    reply_markup: {keyboard: keyboard.afterTop}
                })

            })
        }
        break
//=======
        case kb.afterTop.favorite:{
            console.log(currency);
             helper.getFavorite(chatID,currency).then(list => {
                console.log('I have list from helper.getDB ');
                if (list.length>0) {
                    const listHtml = helper.getHTML(list);
                    bot.sendMessage(chatID, listHtml, {
                        parse_mode: 'HTML',
                        reply_markup: {keyboard: keyboard.add}
                    })
                }
                else {
                    bot.sendMessage(chatID,'Список пуст',{
                        reply_markup:{keyboard:keyboard.add}
                    })
                }
                 })



        }
        break
        case kb.add: {
            console.log('User want to add some bank');
            bot.sendMessage(chatID,'Введите название',{
                reply_markup: {
                    remove_keyboard: true
                }
            }).then(()=>{
                answerCallbacks[chatID] = function (answer) {
                    let bank = answer.text;
                    helper.isInList(bank).then(answer=>{
                        if (answer.length>1) {

                            helper.addFavorite(chatID,answer).then(isIn=>{
                                if (isIn) {
                                    bot.sendMessage(chatID, answer + " был добавлен в список избранных", {
                                        reply_markup: {keyboard: keyboard.add}
                                    });
                                }
                                else {
                                    bot.sendMessage(chatID,answer + ' уже в списке избранных',{
                                        reply_markup: {keyboard: keyboard.add}
                                    })
                                }
                            })

                        }
                        else  bot.sendMessage(msg.chat.id, bank + " такого банка нет",{
                            reply_markup:{keyboard:keyboard.add}
                        });
                    })

                }
             })

        }
        break
            //============
        case kb.home.usd: {
            console.log('User choose usd');
            currency = 'usd';
            helper.listOfBank(currency).then(list=> {
                listOfBank = list.slice();
              //  helper.getDB(1);
                listOfBank = helper.getTopBanks(listOfBank);
                const listHtml = helper.getHTML(listOfBank);
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
                const listHtml = helper.getHTML(listOfBank);
                console.log('I will show top banks with usd');
                bot.sendMessage(chatID,listHtml,{
                    parse_mode: 'HTML',
                    reply_markup: {keyboard: keyboard.home}
                })

            })
        }

    }
})

//bot.on("polling_error", (err) => console.log(err));
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


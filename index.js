'use strict';
const TelegramBot = require("node-telegram-bot-api");
//const config = require('./src/config');
const helper = require('./src/helper');
const kb = require('./src/keyboard-buttons');
const keyboard = require('./src/keyboard');
let chatID;
let currency;
let sum;
let direction;
//const TOKEN = config.TOKEN;
const bot = new TelegramBot(process.env.TOKEN, {
    polling: true
})
let answerCallbacks = {};


bot.on ('message', msg => {
    chatID = helper.getChatId(msg);
    let callback = answerCallbacks[chatID];
    if (callback) {
        delete answerCallbacks[chatID];
        return callback(msg);
    }

    switch (msg.text) {
        case kb.back: {
            console.log('User want to back')
            bot.sendMessage(chatID, `Выберете валюту`, {
                reply_markup: {
                    resize_keyboard: true,
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
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: keyboard.afterTop
                    }
                })

            })
        }
        break

        case kb.afterTop.favorite:{
            console.log(currency);
             helper.getFavorite(chatID,currency).then(list => {
                console.log('I have list from helper.getDB ');
                if (list.length>0) {
                    const listHtml = helper.getHTML(list);
                    bot.sendMessage(chatID, listHtml, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: keyboard.favorite
                        }
                    })
                }
                else {
                    bot.sendMessage(chatID,'Список пуст',{
                        reply_markup:{
                            resize_keyboard: true,
                            keyboard:keyboard.favorite}

                    })
                }
                 })



        }
        break
        case kb.favorite.add: {
            console.log('User want to add some bank');
            bot.sendMessage(chatID,'Введите название',{
                reply_markup: {
                    remove_keyboard: true
                }
            }).then(()=>{
                answerCallbacks[chatID] = function (answer) {
                    let bank = answer.text;
                    console.log('User send ' + bank);
                    helper.isInListOfAllBanks(bank).then(answer=>{
                        if (answer.length>1) {
                            console.log(answer);
                            helper.addFavorite(chatID,answer).then(isIn=>{
                                if (isIn) {
                                    bot.sendMessage(chatID, answer + " был добавлен в список избранных", {
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.favorite
                                        }
                                    });
                                }
                                else {
                                    bot.sendMessage(chatID,answer + ' уже в списке избранных',{
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.favorite
                                        }
                                    })
                                }
                            })

                        }
                        else  bot.sendMessage(msg.chat.id, bank + " такого банка нет",{
                            reply_markup:{
                                resize_keyboard: true,
                                keyboard:keyboard.favorite
                            }
                        });
                    })

                }
             })

        }
        break
        case kb.favorite.delete:{
                bot.sendMessage(chatID,'Введите название банка',{
                    reply_markup: {
                        remove_keyboard: true
                    }
            }).then( ()=> {
                    answerCallbacks[chatID] = function (answer) {
                    const bank = answer.text;
                    helper.isInListOfAllBanks(bank).then(answer=>{
                        if (answer.length>1) {
                            helper.deleteBankFromFavorite(chatID,answer).then(isIn=>{
                                if (isIn)
                                {
                                    bot.sendMessage(chatID, answer + ' был удален из списка избранных',{
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.favorite
                                        }
                                    })
                                }
                                else {
                                    bot.sendMessage(chatID,answer + ' нет в списке избранных',{
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.favorite
                                        }
                                    })
                                }
                            })
                        }

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
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: keyboard.afterTop
                    }
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
                    reply_markup: {
                        resize_keyboard: true,
                        keyboard: keyboard.home
                    }
                })

            })
        }
        break
        case kb.afterTop.calculate:{
            bot.sendMessage(chatID,'Выбирите направление обмена',{
                reply_markup:{
                    resize_keyboard: true,
                    keyboard: keyboard.calculate
                }
            })
        }
        break
        case kb.calculate.buy:{
            sum = 0;
            direction = 'buy';
            bot.sendMessage(chatID,`Введите сумму в ${currency}`,{
                reply_markup:{
                    remove_keyboard: true
                }
            }).then(()=>{
                answerCallbacks[chatID] = function (answer) {
                    sum = answer.text;
                    helper.calculateTopBankBuy(sum).then((list) => {
                        console.log(list)
                        list = helper.getHtmlForCaculate(list);
                        bot.sendMessage(chatID, list, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.whatCurr
                            }
                        })
                    })

                }
            })
        }
        break

        case kb.whatCurr.favoriteBunks: {
            if (direction === 'buy')
            {
                helper.calculateFavoriteBuy(chatID, currency, sum).then(listWithCurr => {
                    console.log(listWithCurr.length);
                    if (listWithCurr.length >= 1) {
                        listWithCurr = helper.getHtmlForCaculate(listWithCurr);
                        bot.sendMessage(chatID, listWithCurr, {

                            parse_mode: 'HTML',
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.home
                            }
                        })
                    } else {
                        bot.sendMessage(chatID, 'Cписок избранных банков пуст', {
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.whatCurr
                            }
                        })
                    }
                });
        }
            else {
                helper.calculateFavoriteSell(chatID, currency, sum).then(listWithCurr => {
                    console.log(listWithCurr.length);
                    if (listWithCurr.length >= 1) {
                        listWithCurr = helper.getHtmlForCaculate(listWithCurr);
                        bot.sendMessage(chatID, listWithCurr, {

                            parse_mode: 'HTML',
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.home
                            }
                        })
                    } else {
                        bot.sendMessage(chatID, 'Cписок избранных банков пуст', {
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.whatCurr
                            }
                        })
                    }
                });
            }

        }
        break
        case kb.whatCurr.myself:{
            let bank_name = '';
            bot.sendMessage(chatID,'Введите название банка',{
                reply_markup:{
                    remove_keyboard:true
                }
            }).then(()=>{
                answerCallbacks[chatID] = function (answer) {
                        bank_name = answer.text;
                        if (direction==='buy') {
                            helper.calculateMyselfBunkBuy(bank_name, currency, sum).then((bankCurr) => {
                                if (bankCurr) {

                                    bankCurr = helper.getHtmlForCaculate(bankCurr);
                                    bot.sendMessage(chatID, bankCurr, {
                                        parse_mode: 'HTML',
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.home
                                        }
                                    })
                                } else {
                                    bot.sendMessage(chatID, 'Данного банка нет', {
                                        reply_markup: {
                                            keyboard: keyboard.whatCurr
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            helper.calculateMyselfBunkSell(bank_name,currency,sum).then((bankCurr)=>{
                                if (bankCurr)
                                {

                                    bankCurr = helper.getHtmlForCaculate(bankCurr);
                                    bot.sendMessage(chatID,bankCurr,{
                                        parse_mode: 'HTML',
                                        reply_markup: {
                                            resize_keyboard: true,
                                            keyboard: keyboard.home
                                        }
                                    })
                                }
                                else {
                                    bot.sendMessage(chatID,'Данного банка нет',{
                                        reply_markup:{
                                            keyboard: keyboard.whatCurr
                                        }
                                    })
                                }
                            })
                        }

                }
            })
        }
        break
        case kb.whatCurr.topBunks:{
            if (direction==='buy') {
                helper.calculateTopBankBuy(sum).then((list) => {
                    console.log(list)
                    list = helper.getHtmlForCaculate(list);
                    bot.sendMessage(chatID, list, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: keyboard.home
                        }
                    })
                })
            }
            else {
                helper.calculateTopBankSell(sum).then((list) => {
                    console.log(list)
                    list = helper.getHtmlForCaculate(list);
                    bot.sendMessage(chatID, list, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: keyboard.home
                        }
                    })
                })
            }

        }
        break
        case kb.calculate.sell:{
            sum = 0;
            direction ='sell'
            bot.sendMessage(chatID,`Введите сумму в grn`,{
                reply_markup:{
                    remove_keyboard: true
                }
            }).then(()=>{
                answerCallbacks[chatID] = function (answer) {
                    sum = answer.text;
                    helper.calculateTopBankSell(sum).then((list) => {
                        console.log(list)
                        list = helper.getHtmlForCaculate(list);
                        bot.sendMessage(chatID, list, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                resize_keyboard: true,
                                keyboard: keyboard.whatCurr
                            }
                        })
                    })

                }
            })
        }
        break

    }
})

bot.on("polling_error", (err) => console.log(err));
bot.onText(/\/start/, msg => {
    const textHello =  `Здравствуйте, ${msg.from.first_name}`;
    bot.sendMessage(chatID,textHello);
    const textChoice = `Выберете валюту`;
    bot.sendMessage(chatID,textChoice, {
        reply_markup:{
            resize_keyboard: true,
            keyboard: keyboard.home
        },

    });
})


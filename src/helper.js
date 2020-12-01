'use strict';
const getList = require('./minfin');
const dbFun = require('../db/index');
let banksVsCurr = [];
let listOfBankk = [];
module.exports = {
    getChatId(msg) {
        return msg.chat.id
    },
    async listOfBank (currency)
    {
        const result = await getList(currency);
     //   banksVsCurr = result;
        listOfBankk = result;
        return result;
    },
    getHTML (listOfBank)
    {
        return listOfBank.map((b,i)=>{
            return `<b>${listOfBank[i].name}</b> : ${listOfBank[i].price_buy} / ${listOfBank[i].price_sale}`
        }).join('\n');
    },

    getTopBanks(listOfBank)
    {
        let listTopBank = [];
        const topBanks = [
            'Альфа-Банк',
            'Приватбанк',
            'Ощадбанк',
            'ПУМБ',
            'OTP Bank',
            'Таскомбанк',
            'Укргазбанк',
        ];
       listOfBank.filter(function (bank) {
            topBanks.forEach(i=>{
                if (bank.name === i) listTopBank.push(bank)
            })

        })

        return listTopBank;
    },
    async isInListOfAllBanks (bankName)
    {
        bankName = bankName.toLowerCase();
        console.log(bankName);
        if ((bankName ==="а банк") || (bankName === 'а-банк')) return 'А-Банк';
        if ((bankName === "полтава банк") || (bankName === "полтава-банк"))  return 'Полтава-Банк';
        if ((bankName === "траст капитал") || (bankName === "траст-капитал"))  return 'Траст-капитал';
        else {
        let result = await dbFun.getNameBanks(bankName);
        if(result[0]) {
            return result[0].name;
        }
        else return result;
        }


    },
    async getFavorite (chatID,currency)
    {

        let result = [];
        let listName = [];
        let listBanksFromDb = await dbFun.listFromDB(chatID).then();
        console.log(listBanksFromDb);
        listBanksFromDb.forEach(i=>{
            listName.push(i.name_bank);
        })

        let listBanks = await this.listOfBank(currency);

         listBanks.filter(function (bank) {
             listName.forEach(i=>{
                 if (bank.name === i) result.push(bank);
             })
         })

        console.log('Now i want to return');

        return result;
    },
   async addFavorite (chatID,nameBank)
    {
        const some = {chat_id: chatID, name_bank: nameBank};
        let isInFavorite = await dbFun.isInFavorite(chatID,nameBank);
        if (isInFavorite.length>0) return false;
        else {
            await dbFun.addBankToFavorite(some);
            return true;
        }

    },
    async deleteBankFromFavorite (chatID,nameBank)
    {
        let isInFavorite = await dbFun.isInFavorite(chatID,nameBank);
        if (isInFavorite.length>0)
        {
            await dbFun.deleteBank(nameBank);
            return true;
        }
        else return false;

    },
    getHtmlForCaculate (listOfBanks)
    {
        return listOfBanks.map((b,i)=>{
            return `<b>${listOfBanks[i].name}</b> : ${listOfBanks[i].curr_buy} grn`
        }).join(('\n'));
    },
   async calculateFavoriteBuy (chatId,currency,sum)
    {
        let listWithCurr = [];
        let listFavorite = await this.getFavorite(chatId,currency)
        for (let bank in listFavorite)
        {
            let bankWithCurr = {};
            bankWithCurr.curr_buy =  Number(listFavorite[bank].price_buy) * sum;
            bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
            bankWithCurr.name = listFavorite[bank].name;
            listWithCurr.push(bankWithCurr);

        }
        return listWithCurr;
    },
    async calculateFavoriteSell (chatId,currency,sum)
    {
        let listWithCurr = [];
        let listFavorite = await this.getFavorite(chatId,currency)
        for (let bank in listFavorite)
        {
            let bankWithCurr = {};
            bankWithCurr.curr_buy =sum/Number(listFavorite[bank].price_buy);
            bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
            bankWithCurr.name = listFavorite[bank].name;
            listWithCurr.push(bankWithCurr);

        }
        return listWithCurr;
    },
   async calculateMyselfBunkBuy (bank_name,currency,sum)
    {

        let listWithCurr = [];

        let bankWithCurr = {};
        let isIn = await this.isInListOfAllBanks(bank_name);
        if (isIn.length >= 1){
            console.log(isIn);
            listOfBankk.filter(bank=>{

                if (bank.name === isIn) {
                    bankWithCurr.name = isIn;
                    bankWithCurr.curr_buy = Number(bank.price_buy) * sum;
                    bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
                }
            })
            listWithCurr.push(bankWithCurr);
            return listWithCurr;
        }
        else return 0;


    },
    async calculateMyselfBunkSell (bank_name,currency,sum)
    {

        let listWithCurr = [];

        let bankWithCurr = {};
        let isIn = await this.isInListOfAllBanks(bank_name);
        if (isIn.length >= 1){
            console.log(isIn);
            listOfBankk.filter(bank=>{

                if (bank.name === isIn) {
                    bankWithCurr.name = isIn;
                    bankWithCurr.curr_buy =  sum/Number(bank.price_buy);
                    bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
                }
            })
            listWithCurr.push(bankWithCurr);
            return listWithCurr;
        }
        else return 0;


    },
    async calculateTopBankBuy(sum)
    {
        let listWithCurr = [];

        let listTopBanks = await this.getTopBanks(listOfBankk);
        for (let bank in listTopBanks)
        {
            let bankWithCurr = {};
            bankWithCurr.curr_buy = (Number(listTopBanks[bank].price_buy)*sum)
            bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
            bankWithCurr.name = listTopBanks[bank].name;
            listWithCurr.push(bankWithCurr)
        }
        return listWithCurr;
    },
    async calculateTopBankSell (sum)
    {
        let listWithCurr = [];

        let listTopBanks = await this.getTopBanks(listOfBankk);
        for (let bank in listTopBanks)
        {
            let bankWithCurr = {};
            bankWithCurr.curr_buy = sum/(Number(listTopBanks[bank].price_buy))
            bankWithCurr.curr_buy = bankWithCurr.curr_buy.toFixed(3);
            bankWithCurr.name = listTopBanks[bank].name;
            listWithCurr.push(bankWithCurr)
        }
        return listWithCurr;
    }

}



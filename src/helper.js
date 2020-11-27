const getList = require('./minfin');
const dbFun = require('../db/index');
let banksVsCurr = [];
module.exports = {
    getChatId(msg) {
        return msg.chat.id
    },
    async listOfBank (currency)
    {
        const result = await getList(currency);
     //   banksVsCurr = result;
        return result;
    },
    getHTML (listOfBank)
    {
        return listOfBank.map((b,i)=>{
            return `<b>${listOfBank[i].name}</b> : ${listOfBank[i].price_buy} / ${listOfBank[i].price_sale}`
        }).join('\n');
    },
    // isInList(nameBank,currency)
    // {
    //     console.log('User want to add ' + nameBank);
    //     let listOfBank = this.listOfBank(currency);
    //     let found = listOfBank.then(banks=>{
    //         banks.some(el=>{
    //             console.log('We found: '+found);
    //            // return el.name_bank == nameBank;
    //         })
    //     })
    //
    //     if(!found) return false;
    //     else return true;
    //
    // },
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
                if (bank.name == i) listTopBank.push(bank)
            })

        })

        return listTopBank;
    },
    async isInList (bankName)
    {
        bankName = bankName.toLowerCase();
        console.log(bankName);
        if ((bankName =="а банк") || (bankName == 'а-банк')) return 'А-Банк';
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
                 if (bank.name == i) result.push(bank);
             })
         })

        console.log('Now i want to return');
         banksVsCurr = result;
        return result;
    },
   async addFavorite (chatID,nameBank)
    {
        const some = {chat_id: chatID, name_bank: nameBank}
        let isInFavorite = await dbFun.isInFavorite(nameBank);
        console.log(isInFavorite )
        if (isInFavorite.length>0) return false;
        else {
            await dbFun.addBankToFavorite(some);
            return true;
        }

    }

}



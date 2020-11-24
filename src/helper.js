const getList = require('./minfin');
module.exports = {
    getChatId(msg) {
        return msg.chat.id
    },
    async listOfBank (currency)
    {
        const result = await getList(currency);
        return result;
    },
    getEuroList (listOfBank)
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
                if (bank.name == i) listTopBank.push(bank)
            })

        })

        return listTopBank;
    },

}



const needle = require("needle");
const cheerio = require("cheerio");
//let url = "https://minfin.com.ua/currency/banks/";


function getList (currency) {
    return new Promise(resolve => {
        let banks = [] ;
       let  url = "https://minfin.com.ua/currency/banks/" + currency + '/';
        console.log(url);
        needle.get(url, function (err, res) {
            if (err) throw (err);
            let $ = cheerio.load(res.body);

            let nbuBank = [];

            function getNameBanck() {
                $('.js-ex-rates').each((index, elem) => {
                    let bank = {
                        name: '',
                        price_buy: 0,
                        price_sale: 0
                    }

                    if ($(elem).find('a')) bank.name = $(elem).find('a').text()

                    bank.name = bank.name.replace(/(\r\n|\n|\r)/gm, " ");
                    bank.name = bank.name.replace(/(^\s*)|(\s*)$/g, '')

                    banks.push(bank);
                })
            }

            function getPriceBuy() {
                $(".mfm-pr0[data-title=\'В кассах банков\']").each((index, elem) => {
                    banks[index].price_buy = $(elem).text()
                })
            }

            function getPriceSale() {
                $(".mfm-pl0[data-title=\'В кассах банков\']").each((index, elem) => {
                    banks[index].price_sale = $(elem).text()
                })
            }

            function getNBUPrice() {

            }

            getNameBanck();
            banks = banks.filter(n => n.name);
            getPriceBuy();
            getPriceSale();

            resolve(banks)
            console.log(banks.length)
        })
    })


    //  return banks;
}

module.exports = getList;
console.log('Data has been send');


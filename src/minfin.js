'use strict';
const needle = require("needle");
const cheerio = require("cheerio");

async function getList (currency) {
    return new Promise(resolve => {
       const needle_params =  {
            open_timeout: 60000,
            read_timeout: 60000,
            compressed: true,
            stream_length: 0
        }
        let banks = [] ;
       let  url = "https://minfin.com.ua/currency/banks/" + currency + '/';
        console.log(url);

        needle.get(url,needle_params, function (err, res) {
            if (err) throw (err);

            let $ = cheerio.load(res.body);


            function getNameBank() {
                $('.js-ex-rates').each((index, elem) => {
                    let bank = {
                        name: '',
                        price_buy: 12,
                        price_sale: 12
                    }

                    if ($(elem).find('a')) bank.name = $(elem).find('a').text()

                    bank.name = bank.name.replace(/(\r\n|\n|\r)/gm, " ");
                    bank.name = bank.name.replace(/(^\s*)|(\s*)$/g, '')
                    banks.push(bank);
                })
            }

            function getPriceBuy() {
                $(".mfm-pr0[data-title=\'В кассах банков\']").each((index, elem) => {
                        banks[index].price_buy =   $(elem).text()
                })

            }

            function getPriceSale() {
                $(".mfm-pl0[data-title=\'В кассах банков\']").each((index, elem) => {
                        banks[index].price_sale = $(elem).text()
                })
            }

            getNameBank();
            banks = banks.filter(n => n.name);
            getPriceBuy();
            getPriceSale();
            resolve(banks)
        })
    })
}

module.exports = getList;
console.log('Data has been send');


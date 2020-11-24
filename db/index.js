'use strict'
const cfg = require('./config').pg;
const knex = require('knex')(cfg);

module.exports = {
    addFavoritwBank (some)
    {


        knex.insert(some).into('favorite').finally(()=>{
            knex.destroy();
        })


    },
    getListFavoriteBanks(chatID) {
        return new Promise(resolve => {
            let bankList = [];
            knex.select("name_bank").from("favorite").where("chat_id",chatID).then((banks)=>{
                //   console.log('I will push ' + banks[0].name_bank);
                bankList = banks;
                resolve(bankList);
                console.log('I pushed');

            }).finally(()=>{

                knex.destroy();

            })

        })
    }

}



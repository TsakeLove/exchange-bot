'use strict'
const cfg = require('./config').pg;
const knex = require('knex')(cfg);
const Promise = require('bluebird');
module.exports = {

   addBankToFavorite: function(some)
   {
       return knex.insert(some).into('favorite').then()
   },

    getNameBanks: function(bankName)
    {
        return knex.select('*').from('banks').whereRaw(`LOWER(name) LIKE ?`, `%${bankName}%`).then()
    },
    listFromDB: function (chatID)
    {
        return knex.select("name_bank").from("favorite").where("chat_id",chatID).then()
    },
    isInFavorite: function(bankName)
    {
        return knex.select('name_bank').from('favorite').where("name_bank",bankName).then()
    },


   async getListFavoriteBanks(chatID) {
        return new Promise(resolve => {
            let bankList = [];
            console.log(chatID);
            knex.select("name_bank").from("favorite").where("chat_id",chatID).then((banks)=>{
                //   console.log('I will push ' + banks[0].name_bank);
             //   console.log(banks);
                console.log(banks);
                bankList = banks;
                resolve(bankList);
                console.log('I pushed');
              //  knex.destroy();
            }).finally(()=>{

                knex.destroy();

            })

        })
    }

}



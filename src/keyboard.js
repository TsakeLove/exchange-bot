const kb = require('./keyboard-buttons');
module.exports = {
    home: [
        [kb.home.euro, kb.home.usd]
    ],
    afterTop: [
        [kb.afterTop.all],
        [kb.back],
        [kb.afterTop.favorite],
        [kb.afterTop.calculate]
        ],
    back: [
        [kb.back]
    ],
    favorite: [
            [kb.favorite.add, kb.favorite.delete],
            [kb.afterTop.favorite, kb.back]
    ],
    calculate: [
        [kb.calculate.buy],
        [kb.calculate.sell],
        [kb.back]
    ],
    whatCurr: [
      [kb.whatCurr.favoriteBunks],
      [kb.whatCurr.myself], [kb.back]
    ]

}

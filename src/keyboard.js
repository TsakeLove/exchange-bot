const kb = require('./keyboard-buttons');
module.exports = {
    home: [
        [kb.home.euro, kb.home.usd]
    ],
    afterTop: [
        [kb.afterTop.all],
        [kb.back], [kb.afterTop.favorite]
        ],
    back: [
        [kb.back]
    ],
    add: [
        [kb.add], [kb.back], [kb.afterTop.favorite]
    ]

}

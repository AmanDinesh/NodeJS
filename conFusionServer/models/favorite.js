const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dish',
            required: true,
        }
    ]
}, {
    timestamps: true
});

var Favorites = mongoose.model('favorite', favoriteSchema);

module.exports = Favorites;


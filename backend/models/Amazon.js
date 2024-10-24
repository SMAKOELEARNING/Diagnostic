const mongoose = require('mongoose');

const amazonSchema = new mongoose.Schema({
    question: String,
    "Piliers RSE": String,
    ESG: String,
    "5P": String,
    "Sphère ISQVT": String,
    Categorie: String,
    odd: Number
});

const Amazon = mongoose.model('Amazon', amazonSchema, 'Amazon');

module.exports = Amazon;

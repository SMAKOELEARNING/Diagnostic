const mongoose = require('mongoose');

const kpiDataSchema = new mongoose.Schema({
    categorie: String,
    spécificité: String,
    score: Number
});

const KPIDatas = mongoose.model('KPIData', kpiDataSchema);

module.exports = KPIDatas;

const mongoose = require('mongoose');

const responseDataNumberSchema = new mongoose.Schema({
    formId: String,
    questionText: String,
    response: String,
    "Piliers RSE": String,
    ESG: String,
    "5P": String,
    "Sphère ISQVT": String,
    Categorie: String
}); 
const ResponseDataNumber = mongoose.model('ResponseDataNumber', responseDataNumberSchema);

module.exports = ResponseDataNumber;

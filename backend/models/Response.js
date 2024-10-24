const mongoose = require('mongoose'); 

const responseSchema = new mongoose.Schema({
    formId: String,
    questionText: String,
    response: String
});

const Response = mongoose.model('Response', responseSchema, 'response');

module.exports = Response;

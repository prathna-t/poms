const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto:true},
    sender: {type: String},
    address: {type: String},
    weight: {type: Number},
    fragile: {type: String}
       

});


module.exports = mongoose.model('Parcel', parcelSchema); 
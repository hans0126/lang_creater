var mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({
    loc: Object,
    name: String,
    category: String
});


var Local = module.exports = mongoose.model('location', LocationSchema, "places");

module.exports.getLocal = function(callback) {
    Local.find({
        loc: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [121.532721, 25.053751]
                },
                $minDistance: 0,
                $maxDistance: 1000
            }
        }
    }, callback);
}

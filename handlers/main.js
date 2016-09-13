var fs = require('fs');
var br = require('os').EOL;
var mkdirp = require('mkdirp');
var Q = require("q");
var mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({
    loc: Object,
    name: String,
    category: String
});

var local = mongoose.model('location', LocationSchema, "places");


exports.getAndCreateFile = function(req, res) {
    var lang = req.body.langs;
    var group = req.body.groups;

    // this.aaaa();
    Q.fcall(createFolder, lang, group)
        .then(createGroupFile)
        .done(function(aa) {
            console.log(aa);
        });

    res.json(200);

    //create lang folder
    function createFolder(_arrLang, _arrGroup) {

        var deferred = Q.defer();
        var promises = [];
        for (var i = 0; i < _arrLang.length; i++) {
            var _p = createLangFolder(_arrLang[i]);
            promises.push(_p);
        }

        Q.all(promises).then(function() {
            console.log("folder");
            deferred.resolve({ langs: _arrLang, groups: _arrGroup });
        })

        return deferred.promise;
    }

    function createLangFolder(_lang) {
        var deferred = Q.defer();
        mkdirp('tmp/' + _lang, function(err) {
            if (err) {
                deferred.reject(new Error(error));
            } else {
                console.log("create fold:" + _lang);
                deferred.resolve();

            }
        })

        return deferred.promise;
    }
    //create group files
    function createGroupFile(_data) {

        var _lang = _data.langs;
        var _group = _data.groups;

        var deferred = Q.defer();
        var promises = [];
        for (var i = 0; i < _lang.length; i++) {

            for (var j = 0; j < _group.length; j++) {
                var filename = "tmp/" + _lang[i] + "/" + _group[j].title + ".js";
                var content = groupFileContent(_lang[i], _group[j].units);

                var _p = writeLangFile(filename, content);
                promises.push(_p);

            }
        }

        Q.all(promises).then(function() {
            console.log("file complete");
            deferred.resolve("ok");
        })

        return deferred.promise;

    }

    function groupFileContent(_lang, _unit) {
        var output = '';
        for (var i = 0; i < _unit.length; i++) {
            var variableName = _unit[i].title;
            var value = '';
            for (var j = 0; j < _unit[i].words.length; j++) {
                if (_unit[i].words[j].lang == _lang) {
                    value = _unit[i].words[j].content;
                    break;
                }
            }

            output += "var " + variableName + " = '" + value + "';" + br;
        }
        console.log(_lang + ":content");

        return output;
    }

    function writeLangFile(_path, _content) {
        var deferred = Q.defer();
        fs.writeFile(_path, _content, function(err) {
            if (err) {
                deferred.reject(new Error(err));
                console.log("error");
            } else {
                deferred.resolve();
                console.log("The " + _path + " was saved!");

            }

        });
        return deferred.promise;
    }

}


exports.getLocal = function(req, res) {

    local.find({
        loc: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [121.532721, 25.053751]
                },
                $minDistance: 0,
                $maxDistance: 5000
            }
        }
    }, function(err, re) {
        
        res.json(200, re);
    })


}

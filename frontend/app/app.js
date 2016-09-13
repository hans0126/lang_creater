var app = angular.module('app', ['datas']);

app.controller("base", ["data_schema","toServer", function(data_schema,toServer) {

    var _self = this;

    //_self.groupInput = "A";

    _self.groups = [];
    _self.currentGroup = null;
    _self.currentUnit = null;
    _self.langs = ["en", "jp"];


    _self.addGroup = function() {

        if (!_self.groupInput || !checkDuplicateTitle(_self.groupInput, _self.groups)) {
            return
        }

        var _d = angular.copy(data_schema.group_data);

        _d.title = _self.groupInput;

        _self.groupInput = null;

        _self.groups.push(_d);


    }


    _self.selectGroup = function(val) {
        _self.currentGroup = val;
    }

    _self.selectUnit = function(val) {
        _self.currentUnit = val;
    }

    _self.addLang = function() {
        if (!_self.langInput) {
            return;
        }

        _self.langs.push(_self.langInput);

        for (var i = 0; i < _self.groups.length; i++) {
            for (var j = 0; j < _self.groups[i].units.length; j++) {
                var w = angular.copy(data_schema.word_data);
                w.lang = _self.langInput;
                _self.groups[i].units[j].words.push(w);

            }
        }

        _self.langInput = null;

    }

    _self.removeLang = function(val) {

        var idx = _self.langs.indexOf(val);

        _self.langs.splice(idx, 1);

        for (var i = 0; i < _self.groups.length; i++) {
            for (var j = 0; j < _self.groups[i].units.length; j++) {
                for (var k = 0; k < _self.groups[i].units[j].words.length; k++) {

                    if (_self.groups[i].units[j].words[k].lang == val) {
                        _self.groups[i].units[j].words.splice(k, 1);
                        break;
                    }

                }
            }
        }
    }


    _self.addUnit = function() {
        if (!_self.unitInput || !_self.currentGroup || !checkDuplicateTitle(_self.unitInput, _self.currentGroup.units)) {
            return
        }

        var _d = angular.copy(data_schema.unit_data);
        _d.title = _self.unitInput;

        for (var i = 0; i < _self.langs.length; i++) {
            var _w = angular.copy(data_schema.word_data);
            _w.lang = _self.langs[i];
            _d.words.push(_w);
        }

        _self.currentGroup.units.push(_d);

        _self.unitInput = null;
    }


    function checkDuplicateTitle(_val, _arr) {
        var has = false;

        for (var i = 0; i < _arr.length; i++) {

            if (_arr[i].title == _val) {
                has = true;
            }
        }

        return !has;

    }

    _self.testSend = function(){

    	toServer.saveData( _self.groups,_self.langs).success(function(){
    		console.log("A");
    	});
    }

}]);

app.factory("toServer",["$http",function($http){
	return {
		saveData:function(groups,langs){
			 return $http.post('/saveData',{
			 	groups:groups,
			 	langs:langs
			 });
		}
	}

}])

app.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown", function(event) {
            if (event.which === 13) {

                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();

            }
        });
    };
});


var datas = angular.module('datas', []);

datas.factory("data_schema", [function() {

    var data = {}

    data.group_data = {
        title: null,
        units: []
    }

    data.unit_data = {
        title: null,
        words: []
    }

    data.word_data = {
        lang: null,
        content: null
    }

    return data;

}])

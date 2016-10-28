var app = angular.module('app', ['datas']);

app.factory('_', ['$window',
    function($window) {
        // place lodash include before angular
        return $window._;
    }
])


app.controller("base", ["data_schema", "toServer", "_", function(data_schema, toServer, _) {

    var _self = this;

    //_self.groupInput = "A";

    _self.msg = {
        del_group: "did you want to delete group ?",
        del_unit: "did you want to delete unit ?",
        del_lang: "did you want to delete language ?"
    }

    _self.groups = [];
    _self.currentGroup = null;
    _self.currentUnit = null;
    _self.langs = ["en", "jp"];

    _self.editMode = false;

    _self.flagBoxTemp = false;

    _self.editData = null;

    _self.editThisData = function(val){
        console.log(val);
         _self.editData = val;
    }


    _self.addGroup = function() {

        if (!_self.groupInput || !checkDuplicateTitle(_self.groupInput, _self.groups)) {
            return
        }

        var _d = angular.copy(data_schema.group_data);

        _d.title = _self.groupInput;

        _self.groupInput = null;

        _self.groups.push(_d);


    }

    _self.changeEditMode = function() {
        _self.editMode = !_self.editMode;
    }


    _self.selectGroup = function(val) {
        _self.currentGroup = val;
    }


    _self.deleteGroup = function(val) {
        var _idx = _self.groups.indexOf(val);
        delete _self.groups[_idx];
        _self.currentGroup = null;
        _self.currentUnit = null;
    }

    _self.selectUnit = function(val) {
        _self.currentUnit = val;
    }

    _self.deleteUnit = function(val) {
        var _idx = _self.groups.indexOf(_self.currentGroup);
        var _unitIdx = _self.groups[_idx].units.indexOf(val);
        _self.groups[_idx].units.splice(_unitIdx, 1);
        _self.currentUnit = null;
    }

    _self.triggerLightbox = function() {


    }



    _self.flagBox = function(msg, fn, va) {

        _self.flagBoxTemp = {
            fn: fn,
            va: va,
            msg: msg
        }

    }

    _self.addLang = function() {
        if (!_self.langInput || _self.langs.indexOf(_self.langInput) > -1) {
            return;
        }

        _self.langs.push(_self.langInput);

        _.forEach(_self.groups, function(_g) {
            _.forEach(_g.units, function(_u) {
                var w = angular.copy(data_schema.word_data);
                w.lang = _self.langInput;
                _u.words.push(w);
            })

        })

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

        _.forEach(_self.langs, function(value, key) {
            var _w = angular.copy(data_schema.word_data);
            _w.lang = value;
            _d.words.push(_w);
        })

        _self.currentGroup.units.push(_d);

        _self.unitInput = null;
    }


    function checkDuplicateTitle(_val, _arr) {
        var _s = _.find(_arr, { title: _val });
        return !_s;
    }

    _self.testSend = function() {

        toServer.saveData(_self.groups, _self.langs).success(function() {
            console.log("A");
        });
    }

}]);

app.factory("toServer", ["$http", function($http) {
    return {
        saveData: function(groups, langs) {
            return $http.post('/saveData', {
                groups: groups,
                langs: langs
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


app.directive('myEditButton', function() {
    return {
        restrict: "A",
        template: "{{mode_text}}",
        scope: {
            mode: "=myEditButton"
        },
        link: function(scope, element, attrs) {
            scope.mode_text = "edit mode";
            element.bind('click', function() {
                scope.mode = !scope.mode;
                if (scope.mode) {
                    scope.mode_text = "normal mode";
                } else {
                    scope.mode_text = "edit mode";
                }

                scope.$apply();
            })
        }
    }
});


app.directive('lightBox', ['$compile', function($compile) {
    return {
        restrict: "A",

        scope: {
            process: "=lightBox"
        },
        link: function(scope, element, attrs) {

            var cancelText = "cancel";
            var outputContent = "<h1>" + scope.process.msg + "</h1>";
            if (typeof(scope.process.fn) == "function") {
                outputContent += "<button ng-click='cancel()'>Cancel</button><button ng-click='delete()'>Delete</button>";
            } else {
                outputContent += "<button ng-click='cancel()'>Ok</button>";
            }

            scope.cancel = function() {
                scope.process = "";
            }

            scope.delete = function() {

                if (Object.prototype.toString.call(scope.process.va) === '[object Array]') {
                    scope.process.fn.apply(null, scope.process.va);
                } else {
                    scope.process.fn(scope.process.va);
                }

                scope.process = "";
            }

            var el = angular.element(outputContent);
            element.append(el);
            $compile(el)(scope);

        }
    }
}])


app.filter('sprintf', function() {

    function parse(str) {
        var args = [].slice.call(arguments, 1),
            i = 0;

        return str.replace(/%s/g, function() {
            return args[i++];
        });
    }

    return function(str) {
        return parse(str, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    };

})

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

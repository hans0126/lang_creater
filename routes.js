var main = require('./handlers/main.js');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(global.appRoot + '/index.html');
    });


    app.post('/saveData', main.getAndCreateFile);

    app.post('/getLocal', main.getLocal);
    app.get('/test', main.test);
}




/*
var basicLoad = require('./handlers/basic_load.js'),
    search = require('./handlers/search.js'),
    statusMapreduce = require('./handlers/status_mapreduce.js'),
    cards = require('./handlers/cards.js'),
    parser = require('./handlers/parser.js')

    multer = require('multer'),
    upload = multer({
        dest: './upload_temp/'
    }),
    cpUpload = upload.fields([{ name: 'thumb', maxCount: 10 }, { name: 'banner', maxCount: 10 }])


module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(global.appRoot + '/index.html');
    });

    //init load 

    app.post('/get_category', basicLoad.getCategory);

    app.post('/get_ability', basicLoad.getAbility);

    app.post('/get_statusAvg', basicLoad.getStatusAvg);

    // search

    app.post('/search', search);

    // status mapreduce

    app.post('/status_mapreduce', statusMapreduce);

    //cards

    app.post('/get_card', cards.getCard);

    app.post('/inherit_card', upload.single('file'), cards.inheritCard);

    app.post('/update_card', upload.single('file'), cards.updateCard);

    app.post('/add_new_card', upload.single('file'), cards.addNewCard);

    //parse
    
    app.get('/_p',parser.parserWeb);
    app.get('/_i',parser.parserImg);


    
    app.get('/p', function(req, res) {
        //parse web data
        var parser = require("./my_modules/parser.js");
        var pF = new parser.parserFaction();



        //pF.startParser();
        //pF.checkHasImg();
        //pF.getNoHasImg();

        pF.on("all complete", function() {
            console.log("parse end")
        })


        pF.on("save complete", function() {
            console.log("this ok");
        })


        //var ca = new parser.createCategory2DB();
        // ca.start();

        // res.send("ok");

    });


}

*/

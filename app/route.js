var Battle = require('./models/battle');

module.exports = function(app) {

    // api ---------------------------------------------------------------------

    //listBattles
    app.get('/api/battles/list'
        , function(req, res) {
        listBattles(req, res);
    });

    //CountBattles
    app.get('/api/battles/count'
        , function(req, res) {
        countBattles(req, res);
    });

    //stats
    app.get('/api/battles/stats'
        , function(req, res) {
        battleStats(req, res);
    });

    //stats
    app.get('/api/battles/search'
        , function(req, res) {
            battleSearch(req, res);
        });

    

    //Endpoint implementations (service methods)---------------------------------------

    // list all battles
    function listBattles(req, res) {
        Battle.find(function(err, battles) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(battles); // return all todos in JSON format
        });
    }

    // count all battles
    function countBattles(req, res) {
        // use mongoose to get all todos in the database
        Battle.count(function(err, battles) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(battles); // return all todos in JSON format
        });
    }

    // battle stats
    function battleStats(req, res) {
        var attacker_outcome = {};
        var response = {};
        getAttackerOutcome(response, res);
        getBattleTypes(response, res);
        getDefenderSize(response, res);
    }

    function getAttackerOutcome(response, res) {
        var attacker_outcome = {}
        Battle.count({"attacker_outcome": "win"},function(err, wins) {
            if (err)
                res.send(err)
            attacker_outcome.win = wins;
        });

        Battle.count({"attacker_outcome": "loss"},function(err, loss) {
            if (err)
                res.send(err);
            attacker_outcome.loss = loss;
        });
        response.attacker_outcome = attacker_outcome;
    }

    function getBattleTypes(response, res) {

        Battle.distinct('battle_type',function(err, battle_types) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            response.battle_type = battle_types;
            //res.json(response);
        });
    }

    function getDefenderSize(response, res) {

        var defender ={};

        Battle.aggregate({
            "$group": {
                "_id": null,
                "avg_df": { "$avg": "$defender_size" } ,
                "min" :{"$min": "defender_size"},
                "max" :{"$max": "defender_size"}
            }
        },function(err, defender_size) {
            if (err)
                res.send(err);
            defender = defender_size[0];
            delete defender._id;
            response.defender_size = defender;
            res.json(response);
        });
    }

    function battleSearch(req, res) {
        var data = {};
        if (req.query.name) {
            var name = '.*' + req.query.name + '.*';
            var value ={};
            value.$regex = name;
            data.name = value;
        }
        if (req.query.type) {
            var type = '.*' + req.query.type + '.*';
            var value ={};
            value.$regex = type;
            data.battle_type = value;
        }
        if (req.query.attacker_king) {
            var attacker_king = '.*' + req.query.attacker_king + '.*';
            var value ={};
            value.$regex = attacker_king;
            data.attacker_king = value;
        }
        if (req.query.defender_king) {
            var defender_king = '.*' + req.query.defender_king + '.*';
            var value ={};
            value.$regex = defender_king;
            data.defender_king = value;
        }
        if (req.query.location) {
            var location = '.*' + req.query.location + '.*';
            var value ={};
            value.$regex = location;
            data.location = value;
        }

        Battle.find(data,function(err, battles) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(battles); // return all todos in JSON format
        });
    }

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

};
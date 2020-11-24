const fs= require('fs');
newman = require('newman');
results = [];
leagues = ['MLB', 'NFL'];
console.log("Testing testing!!");



newman.run({
    reporter: ['cli'],
    collection: require('./Postman Collections/Hao_Sandbox.json'),
    environment: require('./Staging.postman_environment.json'),
    //exportEnvironment: require('./Staging.postman_environment.json')
}).on('start', function (err,arg) {
    console.log("Running a collection....");
}).on('request', function(err, args) {
        if (!err) {
            
            var name = args.item.name;
            console.log((args.item.name.toString()))
            if (name.startsWith('SD')) {
                name = name.replace("SD ","");
                name = name.substring(0, name.indexOf(' '));
                var body = JSON.parse(args.response.stream.toString());
                ids = [];
                for (i in body.page) {
                    ids.push(body.page[i].id);
                }
                results.push({
                    "value": name,
                    "ids": ids
                });
            }
            var body = args.response.stream.toString();
        }
        else {
            console.log("ERROR");
        }
}).on('done', function (err, summary) {
    if (err || summary.err) {
        console.error("ERROR");
    }
    else {
        console.log("Exporting response to json file....");
        fs.writeFileSync('report.json',JSON.stringify(results,null, 4))
        console.log("Collection run completed");
    }
})






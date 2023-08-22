#!/usr/bin/env node
var marked = require('marked')
var fs = require('fs')
var request = require('request')
var argv = require('yargs').argv
var clc = require('cli-color')

//colors... oh ya...
var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;

//validate required args
if(!argv.client_id) {
    console.error(error('Missing --client_id argument. This is your Stackpath client ID for the API.'));
    return;
}

if(argv.client_secret === undefined) {
    console.error(error('Missing --client_secret argument. This is your Stackpath cilent secret for the API.'));
    return;
}

if(argv.start_date === undefined) {
    console.error(error('Missing --start_date argument. Example: 2020-11-15T00:00:00Z.'));
    return;
}

if(argv.end_date === undefined) {
    console.error(error('Missing --end_date argument. Example: 2020-11-30T00:00:00Z'));
    return;
}

if(argv.stack_id === undefined) {
    console.error(error('Missing --stack_id argument. Example: agilitycms-cloud-sites-d2caf6'))
}


//default options
var options = {
    client_id: null,
    client_secret: null,
    start_date: null,
    end_date: null,
    stack_id: null
}

//overwrite defaults
options = {...options, ...argv};

var getAuthToken = function(cb) {
    request({
        method: 'POST',
        uri: `https://gateway.stackpath.com/identity/v1/oauth2/token`,
        body: {
            grant_type: 'client_credentials',
            client_id: options.client_id,
            client_secret: options.client_secret
        },
        json: true,
    }, function(error, response, body) {
        if(error) {
            console.log(error(error));
            return;
        } 
        if(response && response.statusCode) {
            cb(body.access_token);
        }
    });
}

var getMetrics = function(processMetrics) {
    getAuthToken(function(access_token) {
        //make the request to get metrics
        request({
            method: 'GET',
            uri: `https://gateway.stackpath.com/delivery/v1/stacks/${options.stack_id}/metrics?metric_type=TRANSFER&granularity=P1M&platforms=CDE&group_by=SITE&start_date=${options.start_date}&end_date=${options.end_date}`,
            body: data,
            json: true,
            auth: {
                bearer: access_token
            }
        }, function(error, response, body) {
            if(error) {
                console.log(error(error));
                return;
            } 
            if(response && response.statusCode) {
                processMetrics(body);
            }
        });
    })
    
}

getMetrics(function(response) {
    console.log(response);
})

//GO!
// var go = function(article) {
//     fs.readFile(options.file, 'utf8', function(err, data) {
//         if (err) throw err;
        
//         var html = marked(data);

//         article.body = html;
    
//         createArticle(article, function(error, response, body) {
//             if(error) console.error(error);
//             if(response && response.statusCode) console.log(response.statusCode);
//             console.log(body);
//         });
    
        
//     });
// }


// var buildAuthHeader = function() {
//     return {
//         'user': `${options.user}/token`,
//         'pass': options.token,
//         'sendImmediately': true
//        };
// }

// var createArticle = function(article, cb) {
    
//     var data = {
//         article: article
//     };
//     request({
//         method: 'POST',
//         uri: `https://${options.subdomain}.zendesk.com/api/v2/help_center/sections/${options.section_id}/articles.json`,
//         body: data,
//         json: true,
//         auth: buildAuthHeader()
//     }, function(error, response, body) {
//         cb(error, response, body);
//     });
// }

// go({ 
//     title: options.title,
//     body: '', //is set after markdown file is converted to html
//     locale: 'en-us',
//     user_segment_id: options.user_segment_id,
//     permission_group_id: options.permission_group_id,
//     draft: options.draft
// });




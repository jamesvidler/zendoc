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
if(!argv.user) {
    console.error(error('Missing --user argument. This is Zendesk username/email.'));
    return;
}

if(argv.token === undefined) {
    console.error(error('Missing --token argument. This is your API token for Zendesk.'));
    return;
}

if(argv.title === undefined) {
    console.error(error('Missing --title argument. Title is the title of the article you want to import.'));
    return;
}

if(argv.section_id === undefined) {
    console.error(error('Missing --section_id argument. Title is the sectionId of the article you want to import to.'));
    return;
}

if(argv.permission_group_id === undefined) {
    console.error(error('Missing --permission_group_id argument. This is Id of the permission group that can manage the article (i.e. Manager or Agents/Managers).'));
    return;
}

if(argv.file === undefined) {
    console.error(warn('Missing --file argument. The script will continue and assume you have a file located at ./content.md.'));
}

if(argv.draft === undefined || argv.draft === true) {
    console.log("Article will be created as Draft (default behaviour). Pass-in '--draft false' to create and publish. ");
}

//default options
var options = {
    subdomain: 'agilitycms',
    user: null, //passed in from cmd
    token: null, //passed in from cmd
    section_id: -1, //passed in from cmd,
    title: null, //passed in from cmd
    file: './content.md', //assume a file called content.md unless otherwise passed-in
    draft: true,
    user_segment_id: null,
    permission_group_id: null //passed in from cmd
}

//overwrite defaults
options = {...options, ...argv};

if(options.draft) {
    console.log(notice("Article will be published..."))
}

//GO!
var go = function(article) {
    fs.readFile(options.file, 'utf8', function(err, data) {
        if (err) throw err;
        
        var html = marked(data);

        article.body = html;
    
        createArticle(article, function(error, response, body) {
            if(error) console.error(error);
            if(response && response.statusCode) console.log(response.statusCode);
            console.log(body);
        });
    
        
    });
}


var buildAuthHeader = function() {
    return {
        'user': `${options.user}/token`,
        'pass': options.token,
        'sendImmediately': true
       };
}

var createArticle = function(article, cb) {
    
    var data = {
        article: article
    };
    request({
        method: 'POST',
        uri: `https://${options.subdomain}.zendesk.com/api/v2/help_center/sections/${options.section_id}/articles.json`,
        body: data,
        json: true,
        auth: buildAuthHeader()
    }, function(error, response, body) {
        cb(error, response, body);
    });
}

go({ 
    title: options.title,
    body: '', //is set after markdown file is converted to html
    locale: 'en-us',
    user_segment_id: options.user_segment_id,
    permission_group_id: options.permission_group_id,
    draft: options.draft
});




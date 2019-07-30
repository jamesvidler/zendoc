# Introduction 
This package allows you to import an article into the Zendesk Help Center from a Markdown file using a command line. 

## Why
I wanted a way to generate release notes for our product automatically in a CI/D pipeline and then have it upload to Zendesk for review/tweaks before publishing it. 

You could also use it to publish docs from a markdown github repository into zendesk Help Center.


# How to Use It
Install `zendoc` globally so you can use it from the command-line:
```
npm install -g zendoc
```

Run:
```
zendoc --token "xxxxxxxxxxxxxxxxxxxxx" --user  james@xxxxxxxx.com --title "My article title" --section_id 360003512451 --permission_group_id 1364252
```

## Parameters
`--token` -> [string] The API token from zendesk (required)
`--user` -> [string] Your zendesk username (required)
`--title` -> [string] The title for the article you want to import (required)
`--section_id` -> [int] The section_id for the article (required)
`--permission_group_id` -> [int] The permission_group_id for the article, such as the id for *Managers* or *Agents and Managers* (required)
`--draft` -> [bool] Default is **true**, if set to **false** then the article will be published (optional)




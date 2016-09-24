#!/usr/bin/env node

"use strict";
 
var express = require("express");
var app = express();
var path = require("path");
var Fuse = require("fuse.js");
var fuses = {};

app.get("/:filename/:keys(*)/:searchText", function(req, res){
 
    res.type("application/json");
    var filename = path.basename(req.params.filename);
    var fuse ;
    if (!fuses[filename]){
        var data = require("./../data/" + filename  + ".json");
        fuse = new Fuse(data, { include: ["score", "matches" ], tokenize :true, matchAllTokens : true, keys: req.params.keys.split("/") });
        fuses[filename] = fuse;
    } else {
        fuse = fuses[filename];
    }
    var searchResult = fuse.search(req.params.searchText);
    try{ 
        res.jsonp(searchResult.slice(0, 10));
    } catch(e){ 
        console.error(e);
        res.jsonp(e);
    }
    res.end();
});
 
app.listen(process.env.PORT || 9000);

process.on("uncaughtException", function(err){
  console.error(err);
}); 

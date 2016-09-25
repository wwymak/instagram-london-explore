"use strict";
const fs = require('fs');
const async = require('async');
const iconv = require('iconv-lite');
const dataFilePath = './dataFolderS3';
// const dataFilePath = './dataFolder';
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const mongoURI = 'mongodb://localhost:27017/instagram-london';

mongoClient.connect(mongoURI, function(err, db) {
    var collection = db.collection('posts');

    async.waterfall([
        function getFiles(next) {
            fs.readdir(dataFilePath, (err, files) => {
                if(err) {
                    console.log('err in readdir');
                    next(err);
                } else {
                    files.sort((a, b) =>  {if(a<b){return 1} if(a >b) {return -1} return 0});
                    console.log('file names:', files.length, files[0]);
                    next(null, files);
                }
            })
        },

        function processFiles(fileNameArr, next) {
            console.log('procssing files');
            async.mapSeries(fileNameArr, function (fileName, cb ) {
                parseAndWriteToDB(fileName, collection, cb);
            }, function (err, result) {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            })
        }
    ], function (err, result) {
        if(err) {
            console.log('err!1');
        } else {
            console.log('all file saved');
        }
    });
});
function parseOneFile(fileContentArr) {
    var uniques = new Set(fileContentArr.map(d => d.id));
    var output = [];
    for(var i = 0; i< fileContentArr.length; i++ ){
        var id = fileContentArr[i].id;
        if(uniques.has(id)){
            output.push(fileContentArr[i]);
            uniques.delete(id);
        }
    }
    return output;
}

function parseAndWriteToDB(fileName, collection, callback) {
    console.log('fileName: ', fileName);
    async.waterfall([
        function readFile(next) {
            fs.readFile(`${dataFilePath}/${fileName}`, 'utf8', (err, data) => {
                if (err) {
                    console.log('read file err');
                    next(err);
                } else {
                    next(null, JSON.parse(data));
                }
            })
        },
        function parseFileToArr(data, next) {
            var parsed = parseOneFile(data);
            parsed.forEach(d => {
                d.timestamp = new Date(parseInt(d.created_time) * 1000)
            });
            next(null, parsed);
        },
        function writeArrToDB(arr, next) {
            console.log('writeArrToDB');
            async.mapLimit(arr, 3, function (data, cb) {
                collection.insertOne(data, (err, result) => {
                    if (err) {
                        // console.log(err)
                    }
                    cb(null, result);
                });
            }, function (err, res) {
                if (err) {
                    next(err);
                } else {
                    next(null)
                }
            });
        }
    ], function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    })
}

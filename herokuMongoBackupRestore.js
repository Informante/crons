/**
 * Created by jarbitlira on 11/25/15.
 */
var dotenv = require('dotenv');
dotenv.config({silent: true});
dotenv.load();

var restore = require('mongodb-restore');

var dbuser = process.env.INFORMANTE_DB_USERNAME || '';
var dbpassword = process.env.INFORMANTE_DB_PASSWORD || '';
var dbhost = process.env.INFORMANTE_DB_HOST;
var dbport = process.env.INFORMANTE_DB_PORT;
var databaseName = process.env.INFORMANTE_DB_NAME;

var uri = 'mongodb://';
uri += (dbuser && dbpassword) ? dbuser + ':' + dbpassword : ''; //
uri += '@' + dbhost + ':' + dbport + '/' + databaseName;

var backUpName = process.argv[2]; //backup tar file

restore({
    uri: uri,
    root: __dirname + '/bk',
    parser: 'json',
    tar: backUpName,
    logger: __dirname + '/log.log'
});

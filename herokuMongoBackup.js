/**
 * Created by jarbitlira on 11/25/15.
 */
require('dotenv').load();
var backup = require('mongodb-backup');
var moment = require('moment');

var fs = require('fs');
var path = require('path');
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

var dbuser = process.env.INFORMANTE_DB_USERNAME;
var dbpassword = process.env.INFORMANTE_DB_PASSWORD;
var dbhost = process.env.INFORMANTE_DB_HOST;
var dbport = process.env.INFORMANTE_DB_PORT;
var databaseName = process.env.INFORMANTE_DB_NAME;

var uri = 'mongodb://';
uri += (dbuser && dbpassword) ? dbuser + ':' + dbpassword : ''; //
uri += '@' + dbhost + ':' + dbport + '/' + databaseName;

var backUpName = databaseName + '-backup-' + moment().format('DD-MM-YYYY') + '.tar';

//generate backup and send to email
backup({
    uri: uri,
    root: __dirname + '/bk',
    tar: backUpName,
    parser: 'json',
    logger: 'backup.log',
    callback: function () {
        var file = fs.readFileSync(path.join(__dirname, backUpName));
        mailgun.messages().send({
            from:  process.env.MAILGUN_FROM,
            to:  process.env.MAILGUN_TO,
            subject: 'Backup from Informante - ' + backUpName,
            text: 'Backup File ' + backUpName.toString(),
            attachment: new mailgun.Attachment({data: file, filename: backUpName})
        });
    }
});



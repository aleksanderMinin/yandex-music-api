var Request = require('./request');

var HOST = 'localhost',
    PORT = 451,
    SCHEME = 'http';

module.exports.get =  function() {
    return new Request({
        host: HOST,
        port: PORT,
        scheme: SCHEME
    });
};


var request = require('superagent');

var buildUrl = function(path) {
    var apiHost = process && process.env['API_HOST'],
        host = apiHost || "";

    return host + path;
};

var ProgramsController = function(campus, loaderFn) {
    this.campus = campus;
    this.loaderFn = loaderFn;
};

ProgramsController.prototype = {
    getPrograms: function(options, callback) {
        var path = '/programs',
            url = buildUrl(path),
            refresh = options && options.refresh;

        this.loaderFn("programs", "Loading Programs");

        request
            .get(url)
            .query({
                campus: this.campus 
            })
            .end(
                function(err, res) {
                    var body = res && res.body;
                    this.loaderFn("programs", false);
                    callback(err, body);
                }.bind(this)
            );
    }
};

module.exports = ProgramsController;

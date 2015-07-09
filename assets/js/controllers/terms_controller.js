var request = require('superagent');

var buildUrl = function(path) {
    var apiHost = process && process.env['API_HOST'],
        host = apiHost || "";

    return host + path;
};

var TermsController = function(campus, loaderFn) {
    this.campus = campus;
    this.loaderFn = loaderFn;
};

TermsController.prototype = {
    getTerms: function(callback) {
        var path = '/terms',
            url = buildUrl(path);

        this.loaderFn("terms", "Loading Terms");

        var programNo = null;

        request
            .get(url)
            .query({
                program_no: programNo,
                campus: this.campus 
            })
            .end(
                function(err, res) {
                    var body = res && res.body;
                    this.loaderFn("terms", false);
                    callback(err, body);
                }.bind(this)
            );
    }
};

module.exports = TermsController;

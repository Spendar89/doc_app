var request = require('superagent');

var buildUrl = function(path) {
    var apiHost = process && process.env['API_HOST'],
        host = apiHost || "";

    return host + path;
};

var TemplateController = function(templateId, campus, loaderFn) {
    this.templateId = templateId;
    this.campus = campus;
    this.loaderFn = loaderFn;
};

TemplateController.prototype = {
    getTemplate: function(callback) {
        var path = '/templates/' + this.templateId,
            url = buildUrl(path);

        this.loaderFn("Loading Template");

        // Use cached customFIelds:
        //if (template.customFields) {
            //return callback(null, template);
        //};

        request
            .get(url)
            .query({
                campus: this.campus
            })
            .end(
                function(err, res) {
                    var body = res && res.body;
                    this.loaderFn(false);
                    callback(err, body);
                }.bind(this)
            );

    },

    getDocs: function(email, callback) {
        var url = "/docs?email=" + email;
        request
            .get(url)
            .query({
                campus: this.campus
            })
            .end(
                function(err, res) {
                    var docs = res && res.body;
                    this.loaderFn(false);
                    callback(err, res && res.body);
                }.bind(this)
            );
        
    },

    createTemplate: function(template, callback) {

    }
};

module.exports = TemplateController;

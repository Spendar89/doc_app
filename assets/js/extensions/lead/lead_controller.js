var request = require('superagent');

var buildUrl = function(path) {
    var apiHost = process && process.env['API_HOST'],
        host = apiHost || "";

    return host + path;
};

var LeadController = function(leadId, vId, campus, loaderFn) {
    this.leadId = leadId;
    this.vId = vId;
    this.campus = campus;
    this.loaderFn = loaderFn;
};

LeadController.prototype = {
    updateLead: function(leadPending, callback) {
        var path = "/leads/" + this.leadId,
            url = buildUrl(path);

        this.loaderFn("Syncing Lead Data");

        request
            .put(url)
            .send({
                campus: this.campus,
                lead: leadPending
            })
            .end(
                function(err, res) {
                    this.loaderFn(false);
                    callback(err, res && res.body);
                }.bind(this)
            );
    },

    getLead: function(callback) {
        var path = '/leads/' + this.vId,
            url = buildUrl(path);

        if (!this.vId) {
            var err = {
                response: {
                    body: {
                        message: "Cannot fetch leads without leadId",
                        name: "state_error"
                    }
                }
            };
            return callback(err);
        };

        this.loaderFn("Fetching Lead");

        request
            .get(url)
            .query({
                campus: this.campus
            })
            .end(
                function(err, res) {
                    var body = res && res.body;
                    this.leadId = body && body["LeadsID"];
                    this.loaderFn(false);
                    callback(err, body);
                }.bind(this)
            );
    },

    getLeadDocs: function(lead, callback) {
        var leadId = lead["LeadsID"] || this.leadId,
            path = '/leads/' + leadId + '/docs',
            url = buildUrl(path);

        this.loaderFn("Fetching Lead Docs");

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

    destroyLeadDoc: function(lead, doc, callback) {
        var leadId = lead["LeadsID"] || this.leadId,
            docId = doc["DocumentID"],
            path = '/leads/' + leadId + '/docs/' + docId,
            url = buildUrl(path);

        request
            .del(url)
            .query({
                campus: this.campus
            })
            .end(function(err, res) {
                console.log("DESTROY LEAD DOC RES", res);
                if (callback) callback(err, res);
            })
    }
};

module.exports = LeadController;

var request = require('superagent');
var async = require('async');

var buildUrl = function(path) {
        var apiHost = process && process.env['API_HOST'],
            host = apiHost || ""; 

        return host + path;
};

var syncLead = function(callback) {
    var leadId = this.state.extensions.lead["LeadsID"],
        lead = this.state.extensions.leadPending,
        path = "/leads/" + leadId,
        campus = this.state.campus;

    this.setLoading("Syncing Lead Data");

    request
        .put(path)
        .send({
            campus: campus,
            lead: lead
        })
        .end(function(err, res) {
            callback(err, res && res.body);
        });
};

var syncLeadAndSetState = function() {
    async.series([
        syncLead.bind(this),
        this._fetchLeadAndSetState
    ], function(err, data) {
        if (err) {
            this.setState({
                docError: err.response.body
            })
        }
    }.bind(this));
};

var LeadManager = {

    _fetchLead: function(callback) {
        var leadId = this.state.leadId,
            path = '/leads/' + leadId,
            url = buildUrl(path),
            campus = this.state.campus;

        if (!leadId) {
            var err = {
                message: "Cannot fetch leads without leadId", 
                name: "state_error"
            };
            return callback(err);
        };

        this.setLoading("Fetching Lead");

        request
            .get(url)
            .query({
                campus: campus
            })
            .end(function(err, res) {
                callback(err, res && res.body);
            });
    },

    _setStateFromLead: function(lead, callback) {
        this.context.tree.update({
            extensions: {
                lead: {
                    $set: lead
                },
                leadPending: {
                    $set: {}
                }
            },
            recipient: {
                $set: {
                    email: lead["Email"],
                    name: lead["FName"] + " " + lead["LName"]
                }
            }
        });

        if (callback)
            callback(null, lead);
    },

    _fetchLeadDocs: function(lead, callback) {
        var leadId = lead["LeadsID"],
            path = '/leads/' + leadId + '/docs',
            campus = this.state.campus;

        this.setLoading("Fetching Lead Docs");

        request
            .get(path)
            .query({
                campus: campus
            })
            .end(function(err, res) {
                callback(err, res && res.body);
            });
    },

    _setStateFromDocs: function(docs, callback) {
        this.cursors.extensions.set({
            docs: docs
        });
        callback(null, docs);
    },

    _fetchLeadAndSetState: function(callback) {
        return async.waterfall(
            [
                this._fetchLead,
                this._setStateFromLead,
                this._fetchLeadDocs,
                this._setStateFromDocs
            ],
            callback
        );
    },

    getInitialState: function() {
        return {
            leadId: "1409446",
            syncRemote: true
        };
    },

    _defaultCallback: function(err, data) {
        if (err) {
            this.setState({
                docError: err.response.body
            });
        };
        if (this.state.docUrl)
            this.setLoading(false);
    },

    componentWillMount: function() {
        this._fetchLeadAndSetState(this._defaultCallback);
    },

    componentDidUpdate: function(prevProps, prevState) {
        var shouldSync = (!prevState.docUrl && this.state.docUrl &&
            this.state.syncRemote && _.any(this.state.extensions.leadPending));
        if (shouldSync) syncLeadAndSetState.call(this);
        if (this.state.leadId != prevState.leadId) this._fetchLeadAndSetState(this._defaultCallback);
    },

    updateLeadPending: function(key, value) {
        if (_.has(this.state.extensions.lead, key)) {
            this.cursors.extensions.set(["leadPending", key], value);
        };
    }
};

module.exports = LeadManager;

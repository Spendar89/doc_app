var request = require('superagent');

var setStateFromDocs = function(docs, callback) {
    this.setState({
        docs: docs
    });
    callback(null, docs);
};

var fetchLeadDocs = function(lead, callback) {
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
};

var fetchLeadAndSetState = function() {
    if (!this.state.leadId) return this.fetchTemplateAndSetState();
    async.waterfall([
            fetchLead.bind(this),
            setStateFromLead.bind(this),
            fetchLeadDocs.bind(this),
            setStateFromDocs.bind(this)
        ],
        function(err, data) {
            if (err) {
                this.setState({
                    docError: err.response.body
                });
            };
            this.fetchTemplateAndSetState();
            //this.currentTemplate().customFields
                //? this.setLoading(false)
                //: this.setLoading("Loading Template");
        }.bind(this));
};

var setStateFromLead = function(lead, callback) {
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
};

var fetchLead = function(callback) {
    var leadId = this.state.leadId,
        path = '/leads/' + leadId,
        campus = this.state.campus;

    this.setLoading("Fetching Lead");

    request
        .get(path)
        .query({
            campus: campus
        })
        .end(function(err, res) {
            callback(err, res && res.body);
        });
};

var syncLead = function(callback) {
    var leadId = this.state.lead["LeadsID"],
        lead = this.state.lead,
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
        fetchLeadAndSetState.bind(this)
    ], function(err, data) {
        if (err) {
            this.setState({
                docError: err.response.body
            })
        }
    }.bind(this));
};

var LeadManager = {
    getInitialState: function() {
        return {
            leadId: "1409446",
            syncRemote: true
        };
    },

    componentWillMount: function() {
        fetchLeadAndSetState.call(this);
    },

    componentDidUpdate: function(prevProps, prevState) {
        var shouldSync = (!prevState.docUrl && this.state.docUrl &&
            this.state.syncRemote && _.any(this.state.extensions.leadPending));
        if (shouldSync) syncLeadAndSetState.call(this);
        if (this.state.leadId != prevState.leadId) fetchLeadAndSetState.call(this);
    },

    updateLeadPending: function(key, value) {
        if (_.has(this.state.extensions.lead, key)) {
            this.cursors.extensions.set(["leadPending", key], value);
        };
    }
};

module.exports = LeadManager;

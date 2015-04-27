var request = require('superagent');

var setStateFromDocs = function(docs, callback) {
        this.setState({
            docs: docs
        });
        callback(null, docs);
};

var fetchLeadDocs = function(lead, callback) {
    this.setLoading("Fetching Lead Docs");
    var leadId = lead["LeadsID"],
        path = '/leads/' + leadId + '/docs',
        campus = this.state.campus;

    request
        .get(path) 
        .query({campus: campus})
        .end(function(err, res) {
           callback(err, res && res.body); 
        });
};

var fetchLeadAndSetState = function() {
    async.waterfall([
        fetchLead.bind(this),
        setStateFromLead.bind(this),
        fetchLeadDocs.bind(this),
        setStateFromDocs.bind(this)
    ], function(err, data) {
        if (err) {
            this.setState({docError: err.response.body});
        } 
        else {
            if (this.state.template.customFields) {
                this.setLoading(false);
            } 
            else {
                this.setLoading("Loading Template")
            }
            
        }
    }.bind(this))
};

var setStateFromLead = function(lead, callback) {
    if (lead["error"]) {
        console.log("errrorrr")
        this.setState({
            docError: lead["error"],
        });
    } else {
        this.setState({
            lead: lead,
            leadPending: {},
            recipient: {
                email: lead["Email"], 
                name: lead["FName"] + " " + lead["LName"]
            }
        });
    }
    callback(null, lead);
};

var fetchLead = function(callback) {
    this.setLoading("Fetching Lead");
    var leadId = this.props.params.leadId,
        path = '/leads/' + leadId,
        campus = this.state.campus;

    request
        .get(path)
        .query({campus:campus})
        .end(function(err, res) {
           callback(err, res && res.body); 
        });
};

var syncLead = function(callback) {
    var leadId = this.state.lead["LeadsID"],
        lead = this.state.lead,
        path = "/leads/" + leadId,
        campus = this.state.campus;

    request
        .put(path)
        .send({ campus: campus, lead: lead })
        .end(function(err, res) {
           callback(err, res && res.body); 
        });
};

var syncLeadAndSetState = function(callback) {
    this.setLoading("Syncing Lead Data");
    async.series([
        syncLead.bind(this),
        fetchLeadAndSetState.bind(this)
    ]);
};


var LeadManager = {
    getInitialState: function() {
        return {
            lead: {},
            leadPending: {},
            syncRemote: true
        }
    },

    componentWillMount: function() {
        fetchLeadAndSetState.call(this)
    },

    componentWillReceiveProps: function(nextProps) {
        var oldLeadId = this.props.params.leadId;
        var newLeadId = nextProps.params.leadId;
        if (oldLeadId != newLeadId) {
            async.series([
                _.partial(fetchLeadAndSetState.bind(this), newLeadId),
                setDocsFromLead.bind(this)
            ]);
            //fetchLeadAndSetState.call(this, newLeadId);
        };
    },

    componentDidUpdate: function(prevProps, prevState) {
        var shouldSync = (!prevState.docUrl && this.state.docUrl &&
                this.state.syncRemote && _.any(this.state.leadPending));
        if (shouldSync) syncLeadAndSetState.call(this);
    },

    updateLeadPending: function(key, value) {
        if (_.has(this.state.lead, key)) {
            var leadPending = _.extend(this.state.leadPending, {});
            leadPending[key] = value;
            this.setState({
                leadPending: leadPending
            });
        }
    }
};

module.exports = LeadManager;

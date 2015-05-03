var async = require('async'),
    LeadController = require('./lead_controller.js');

var setLeadController = function() {
    var lead = this.state.extensions.lead,
        leadId = lead && lead["LeadsID"],
        vId = this.state.leadId,
        campus = this.state.campus,
        loaderFn = this.setLoading;

    this.leadController = new LeadController(leadId, vId, campus, loaderFn);
    return this.leadController;
};

var LeadManager = {

    _fetchLeadAndSetState: function(callback) {
        var leadController = setLeadController.call(this),
            getLead = leadController.getLead.bind(leadController),
            getLeadDocs = leadController.getLeadDocs.bind(leadController);

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
        }.bind(this);

        var setStateFromDocs = function(docs, callback) {
            this.cursors.extensions.set('docs', docs);
            callback(null, docs);
        }.bind(this);

        return async.waterfall(
            [
                getLead,
                setStateFromLead,
                getLeadDocs,
                setStateFromDocs
            ],
            callback
        );
    },

    _syncLeadAndSetState: function() {
        var leadId = this.state.extensions.lead["LeadsID"],
            leadPending = this.state.extensions.leadPending,
            leadController = setLeadController.call(this),
            updateLead = _.partial(leadController.updateLead.bind(leadController), leadPending);

        async.series(
            [
                updateLead,
                this._fetchLeadAndSetState
            ], 
            function(err, data) {
                if (err) {
                    this.setState({
                        docError: err.response.body
                    });
                };
            }.bind(this)
        );
    },

    _defaultCallback: function(err, data) {
        if (err) {
            this.setState({
                docError: err.response.body
            });
        };
        if (this.state.docUrl || this.currentTemplate().customFields)
            this.setLoading(false);
    },

    getInitialState: function() {
        return {
            leadId: "1409446",
            syncRemote: true
        };
    },

    componentWillMount: function() {
        this._fetchLeadAndSetState(this._defaultCallback);
    },

    componentDidUpdate: function(prevProps, prevState) {
        var shouldSync = (!prevState.docUrl && this.state.docUrl &&
            this.state.syncRemote && _.any(this.state.extensions.leadPending));
        if (shouldSync) this._syncLeadAndSetState();

        // New LeadID from Velocify lead search
        if (this.state.leadId != prevState.leadId) {
            this.cursors.allCustomFields.set({});
            this._fetchLeadAndSetState(this._defaultCallback);
        };

        // If New Lead Fetched From Lead Search, Set New CustomFields Without
        // Fetching New Template
        var lead = this.state.extensions.lead;
        var prevLead = prevState.extensions.lead;
        if (lead && prevLead && lead["LeadsID"] != prevLead["LeadsID"]) {
            this.setCustomFields(this.currentTemplate(), function(err, template) {
                this.cursors.templates.set(this.state.templateIndex, template);
            }.bind(this));
        }

    },

    setLeadPending: function(key, value) {
        if (_.has(this.state.extensions.lead, key)) {
            this.cursors.extensions.set(["leadPending", key], value);
        };
    }
};

module.exports = LeadManager;

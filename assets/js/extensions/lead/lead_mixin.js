var async = require('async'),
    LeadController = require('./lead_controller.js');

var setLeadController = function(vId, campus) {
    var lead = this.state.extensions.lead,
        leadId = lead && lead["LeadsID"],
        campus = campus,
        loaderFn = this.setLoading;

    this.leadController = new LeadController(leadId, vId, campus, loaderFn);
    return this.leadController;
};

var getLeadId = function(extensions) {
    var lead = extensions.lead;
    return lead && lead["LeadsID"];
};

var LeadMixin = {

    _fetchLeadAndSetState: function(vId, campus, callback) {
        var leadController = setLeadController.call(this, vId, campus);

        var getLead = leadController.getLead.bind(leadController);
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

        var getLeadDocs = leadController.getLeadDocs.bind(leadController);
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
            vId = this.props.query.vId,
            campus = this.props.query.campus,
            leadPending = this.state.extensions.leadPending,
            leadController = setLeadController.call(this, null, campus),
            updateLead = leadController.updateLead.bind(leadController);

        async.series(
            [
                _.partial(updateLead, leadPending),
                _.partial(
                    this._fetchLeadAndSetState,
                    vId,
                    campus
                )
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

    setLeadPending: function(key, value) {
        var hasField =_.has(this.state.extensions.lead, key);

        if (hasField) {
            this.cursors.extensions.set([
                "leadPending", 
                key
            ], value);
        };
    },

    getInitialState: function() {
        return {
            syncRemote: true
        };
    },

    componentDidMount: function() {
        if (this.props.query.vId) {
            this._fetchLeadAndSetState(
                this.props.query.vId, 
                this.props.query.campus, 
                this._handleLoading
            );
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var hasNewVid = this.props.query.vId != nextProps.query.vId;

        if (hasNewVid) {
            this.cursors.allCustomFields.set({});
            this._fetchLeadAndSetState(
                nextProps.query.vId, 
                nextProps.query.campus, 
                this._handleLoading
            );
        };

    },

    componentDidUpdate: function(prevProps, prevState) {
        var hasLeadPending = this.state.syncRemote && _.any(this.state.extensions.leadPending),
            hasNewDocUrl = !prevState.docUrl && this.state.docUrl,
            hasChangedLead = getLeadId(this.state.extensions) != getLeadId(prevState.extensions);

        if (hasNewDocUrl && hasLeadPending) {
            this._syncLeadAndSetState();   
        };

        if (hasChangedLead){
            var lead = this.state.extensions.lead;
            this.leadDidUpdate && this.leadDidUpdate(lead);
        };
    }

};

module.exports = LeadMixin;

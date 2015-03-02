var DocForm = require('./../../doc/doc_form.jsx')
var CustomMethods = require('./../../../lib/custom_methods.js');
var CustomFieldsManager = require('./../../../lib/custom_fields_manager.js');

var fetchLead = function (leadId, callback) {
    return $.get('/leads/' + leadId, function(data) {
        return callback(data)
    });
};

var LeadShowTemplate = React.createClass({

    getInitialState: function () {
        return {
            lead: {},
            customFields: {}
        }
    },

    setCustomFieldsFromLead: function (lead) {
        this.setState({customFields: CustomFieldsManager.setLeadFields(lead)});
    },

    updateCustomField: function (fieldName, field) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = field;
        this.setState({customFields: cf})
        if (field.customMethod) {
            CustomMethods[field.customMethod](this);
        }
    },

    setStateFromLead: function (lead) {
        this.setState({lead: lead})
        this.setCustomFieldsFromLead(lead);
    },
    
    componentWillMount: function () {
        fetchLead(this.props.params.leadId, this.setStateFromLead);
    },

    componentWillReceiveProps: function (nextProps) {
        var oldLeadId = this.props.params.leadId;
        var newLeadId = nextProps.params.leadId;
        if (oldLeadId != newLeadId) {
            fetchLead(newLeadId, this.setStateFromLead);
        }
    },

    render: function() {
        return (
            <div className="app-template-div container">
                <div className="col-sm-8 col-sm-offset-2">
                    <h1> Create Document for Signing: </h1>
                    <DocForm updateCustomField={this.updateCustomField} 
                             customFields={this.state.customFields} 
                             lead={this.state.lead} />
                </div>
            </div>
        )
    }
});

module.exports = LeadShowTemplate;

var DocForm = require('./../doc/doc_form.jsx')
var CustomMethods = require('./../../lib/custom_methods.js');

var fetchLead = function (leadId, callback) {
    return $.get('/leads/' + leadId, function(data) {
        return callback(data)
    })
};

var getCustomFields = function (lead) {
    return {
        Phone: {
            value: lead.home_phone
        },
        Name: {
            value: lead.first_name
        },
        Email: {
            value: lead.email_1,
            customMethod: "setName"
        }
    }
};

var LeadShowTemplate = React.createClass({

    getInitialState: function () {
        return {
            lead: {},
            customFields: {}
        }
    },

    setCustomFieldsFromLead: function (lead) {
        this.setState({customFields: getCustomFields(lead)});
    },

    updateCustomFieldValue: function (fieldName, fieldValue, customMethod) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = {value: fieldValue, customMethod: customMethod};
        this.setState({customFields: cf})
        if (customMethod) {
            CustomMethods[customMethod](this);
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
                <DocForm updateCustomFieldValue={this.updateCustomFieldValue} customFields={this.state.customFields} lead={this.state.lead}/>
            </div>
        )

    }

});

module.exports = LeadShowTemplate;

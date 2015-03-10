var TemplateInput = require('./template_input.jsx');
var LeadInputs = require('./lead_inputs.jsx');
var DocForm = require('./../../doc/new/doc_form.jsx');
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
            customFields: false,
            templateId: "4fcfdb574166a271960025ff5dab3a3c941672a5",
            name: "",
            email: ""

        }
    },

    setCustomFieldsFromLead: function (lead) {
        CustomFieldsManager.fetchCustomFields(lead, this.state.templateId, this.state.customFields, function(data) {
            this.setState({customFields: data});
        }.bind(this));
    },

    updateCustomField: function (fieldName, field) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = field;
        this.setState({customFields: cf});
        if (field.customMethod) field.customMethod(this);
    },

    setStateFromLead: function (lead) {
        this.setState({ lead: lead, 
                      email: lead["Email"], 
                      name: lead["FName"] + " " + lead["LName"]
        });
        this.setCustomFieldsFromLead(lead);
    },

    handleTemplateInputSubmit: function () {
       this.setCustomFieldsFromLead(this.state.lead);
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

    handleFormComplete: function (data) {
        window.location.href = "#/docs/" + data.signature_request_id + "?url=" + data.url;
    },

    handleTemplateInputChange: function (e) {
        var templateId = e.target.value;
        this.setState({templateId: templateId});   
    },

    handleLeadEmailInputChange: function (e) {
        var val = e.target.value;
        this.setState({email: val})
    },

    handleLeadNameInputChange: function (e) {
        var val = e.target.value;
        this.setState({name: val});   
    },

    render: function() {
        return (
            <div className="app-template-div container">
                <h1 className="page-header"> Create Document for Signing: </h1>
                <div className="col-sm-4">
                    <TemplateInput templateId={this.state.templateId} onChange={this.handleTemplateInputChange} onSubmit={this.handleTemplateInputSubmit}/>
                    <LeadInputs onEmailChange={this.handleLeadEmailInputChange} 
                                onNameChange={this.handleLeadNameInputChange} 
                                name={this.state.name} email={this.state.email} />
                </div>
                <div className="col-sm-8">
                    <DocForm templateId={this.state.templateId} 
                             updateCustomField={this.updateCustomField} 
                             customFields={this.state.customFields} 
                             onComplete={this.handleFormComplete}
                             leadId={this.props.params.leadId}
                             email={this.state.email}
                             name={this.state.name}
                             lead={this.state.lead} />
                </div>
            </div>
        )
    }
});

module.exports = LeadShowTemplate;

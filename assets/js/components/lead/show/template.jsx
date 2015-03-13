var TemplateInput = require('./template_input.jsx');
var LeadInputs = require('./lead_inputs.jsx');
var LeadData = require('./lead_data.jsx');
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
            syncRemote: true,
            leadUpdates: {},
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

    fetchLeadDocuments: function (lead) {
        $.get('/leads/' + lead["LeadsID"] + '/docs', function (data) {
            console.log("DOCS", data)
        } )
    },

    updateCustomField: function (fieldName, field) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = field;
        this.setState({customFields: cf});
        if (field.customMethod) field.customMethod(this);
        if (_.has(this.state.lead, fieldName)) {
            this.updateLeadUpdate(fieldName, field.value)
        }
    },

    updateLeadUpdate: function (key, value) {
        var lu = _.extend(this.state.leadUpdates, {});
        lu[key] = value;
        this.setState({leadUpdates: lu});
    },

    updateLead: function (cb) {
        $.ajax({
            url: "/leads/" + this.state.lead["LeadsID"],
            method: "PUT",
            data: {lead: this.state.leadUpdates}
        })
        .success(function(data) {
            if (cb) {
                cb(data)   
            } else {
                fetchLead(this.props.params.leadId, this.setStateFromLead);
            };
        }.bind(this));
    },

    setStateFromLead: function (lead) {
        this.setState(
            { lead: lead, 
                email: lead["Email"], 
                name: lead["FName"] + " " + lead["LName"] });
        this.setCustomFieldsFromLead(lead);
        this.fetchLeadDocuments(lead)
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
        var cb = function () {
            window.location.href = "#/docs/" + data.signature_request_id + "?url=" + data.url;
        };
        if (this.state.syncRemote) {
            this.updateLead(cb)
        } else {
            cb()
        };
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

    handleSync: function (e) {
        var syncRemote = this.state.syncRemote;
        this.setState({syncRemote: !syncRemote});
    },

    render: function() {
        return (
            <div className="app-template-div container-fluid">
                <h1 className="page-header"> Create Document for Signing: </h1>
                <div className="col-sm-3">
                    <TemplateInput templateId={this.state.templateId} onChange={this.handleTemplateInputChange} onSubmit={this.handleTemplateInputSubmit}/>
                    <LeadInputs onEmailChange={this.handleLeadEmailInputChange} 
                                onNameChange={this.handleLeadNameInputChange} 
                                name={this.state.name} email={this.state.email} />
                </div>
                <div className="col-sm-6">
                    <DocForm templateId={this.state.templateId} 
                             updateCustomField={this.updateCustomField} 
                             customFields={this.state.customFields} 
                             onComplete={this.handleFormComplete}
                             leadId={this.props.params.leadId}
                             email={this.state.email}
                             name={this.state.name}
                             lead={this.state.lead} />
                </div>
                <div className="col-sm-3">
                    <LeadData lead={this.state.lead} 
                              leadUpdates={this.state.leadUpdates} 
                              customFields={this.state.customFields}
                              syncRemote={this.state.syncRemote}
                              handleSync={this.handleSync}
                              handleSubmit={this.updateLead} />
                </div>
            </div>
        )
    }
});

module.exports = LeadShowTemplate;

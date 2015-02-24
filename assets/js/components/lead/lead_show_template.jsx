var DocForm = require('./../doc/doc_form.jsx')
var CustomMethods = require('./../../lib/custom_methods.js');

var fetchLead = function (leadId, callback) {
    return $.get('/leads/' + leadId, function(data) {
        return callback(data)
    })
};

var getCustomFields = function (lead) {
    return {
        "First Name": {
            header: "Bio",
            value: lead["FName"]
        },
        "Middle Initial": {
            value: lead["MInitial"]
        },
        "Last Name": {
            value: lead["LName"]
        },
        "Date of Birth": {
            value: lead["DateOfBirth"]
        },
        "Gender": {
            value: lead["Gender"]
        },
        "Ethnicity": {
            value: lead["Ethnicity"]
        },
        "Home Phone": {
            value: lead["Phone"]
        },
        "Mobile Phone": {
            value: lead["PhoneMobile"]
        },
        "Work Phone": {
            value: lead["PhoneOther"]
        },
        "Address 1": {
            value: lead["Address"]
        },
        "City": {
            value: lead["City"]
        },
        "Zip": {
            value: lead["Zip"]
        },
        "Address 2": {
            value: lead["Address2"]
        },
        "State": {
            value: lead["State"]
        },
        "Country": {
            value: lead["Country"]
        },
        "Email": {
            value: lead["Email"],
            customMethod: "setName"
        },
        "Marital Status": {
            value: lead["MaritalStatus"]    
        },
        "SSN": {
            value: lead["SSN"]
        },
        "Drivers License No": {
            value: lead["DriversLicense"]
        },
        "Drivers License State": {
            value: lead["DriversLicenseState"]
        },
        "Secondary Education": {
            header: "Previous Education",
            value: lead["SecondaryEducation"]
        },
        "POG": {
            value: lead["POG"]
        },
        "HS Grad Date": {
            value: lead["HSGradDate"]
        },
        "Highest Level of Education.": {
            value: lead["HighestLevelEducation"]
        },
        "Previous College": {
           value: lead["PreviousCollege"] 
        },
        "Campus": {
            header: "Enrollment Info",
            value: lead["Campus"]
        },
        "Admissions Rep": {

        },
        "Admissions Rep Email": {

        },
        "Program": {
            header: "Select Program",
            value: lead["Program"],
            options: ["", "Accounting", "Finance", "English"],
            customMethod: "setStartDate"
        },
        "Start Date": {
            value: lead["StartDate"]

        },
        "Grad Date": {
            value: lead["GradDate"]
        },
        "Weeks": {
            type: "number",
            value: lead["Weeks"]
        },
        "Student Type": {
            value: lead["StudentType"]
        },
        "Session": {
            value: lead["Session"]
        },
        "Contract Signed Date": {
            value: lead["ContractSignedDate"]    
        },
        "Institution/Location": {
            header: "Post Secondary Education",
            value: lead["InstitutionLocation"]
        },
        "Type of Diploma/Degree": {

        },
        "Field of Study": {

        },
        "Start Data": {
            
        },
        "End Date": {

        },
        "Graduated": {
            value: lead["Graduated"]
        },
        "Program Results in Diploma": {
            header: "Additional Info",
            value: lead["Diplorma"]
        },
        "Requires National Certification": {
            
        },
        "Funding Type": {

        },
        "MOU Month": {

        },
        "MOU Year": {

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
                <DocForm updateCustomField={this.updateCustomField} customFields={this.state.customFields} lead={this.state.lead}/>
            </div>
        )

    }

});

module.exports = LeadShowTemplate;

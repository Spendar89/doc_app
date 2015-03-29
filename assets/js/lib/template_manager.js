var CUSTOM_METHODS = require('./custom_methods.js');
//var CUSTOM_VALIDATORS = require('./custom_validators.js');
var PROGRAM_DATA = require('./data/program_data.js');

var CUSTOM_OPTIONS = {
    "Program": _.keys(PROGRAM_DATA),
    "StartDate": []
};

var CUSTOM_TYPES = {
    "Date": "date",
    "Email": "email",
    "Phone": "tel",
    "DateOfBirth": "date",
    "DOB": "date"
};

var DISABLED_FIELDS = [
    "GradDate", "Weeks", "Morning", "Evening", "Afternoon"
];

TemplateManager = {

    fetchTemplate: function (lead, templateId, customFields, callback) {
        // Fetches field object from server
        var data = {"FName":{"name":"FName","type":"text"},"MInitial":{"name":"MInitial","type":"text"},"LName":{"name":"LName","type":"text"},"Date":{"name":"Date","type":"text"},"Address":{"name":"Address","type":"text"},"City":{"name":"City","type":"text"},"Zip":{"name":"Zip","type":"text"},"DateOfBirth":{"name":"DateOfBirth","type":"text"},"SocialSecurityNumber":{"name":"SocialSecurityNumber","type":"text"},"Phone":{"name":"Phone","type":"text"},"total":{"name":"total","type":"text"},"Email":{"name":"Email","type":"text"},"Program":{"name":"Program","type":"text"},"StartDate":{"name":"StartDate","type":"text"},"Morning":{"name":"Morning","type":"checkbox"},"Afternoon":{"name":"Afternoon","type":"checkbox"},"Evening":{"name":"Evening","type":"checkbox"},"GradDate":{"name":"GradDate","type":"text"},"Weeks":{"name":"Weeks","type":"text"}}
        return $.get('/templates/' + templateId, function(data) {
            var fields = {};

            _.each(data.custom_fields, function (field, name) {
                // prepopulates form with diamond lead data if template field
                var fieldValue;

                if (customFields[name]) {
                    fieldValue = customFields[name].value || lead[name];
                } else {
                    fieldValue = lead[name];
                }

                // name matches diamond lead column name
                fields[name] = _.extend(field, {
                    value: fieldValue
                });

                // Adds options if CUSTOM_OPTIONS has matching key
                if (CUSTOM_OPTIONS[name]) {
                    fields[name].options = CUSTOM_OPTIONS[name];
                };
                
                //Adds customMethod if CUSTOM_METHODS has matching key
                if (CUSTOM_METHODS[name]) {
                    fields[name].customMethod = CUSTOM_METHODS[name];
                };

                if (CUSTOM_TYPES[name]) {
                    fields[name].type = CUSTOM_TYPES[name]
                }

                if (_.include(DISABLED_FIELDS, name)) {
                    fields[name].disabled = true;
                };

                return field;
            });

            return callback(fields, data);
        });
    }

    //setLeadFields: function (lead) {
        //return {
            //"First Name": {
                //header: "Bio",
                //value: lead["FName"]
            //},
            //"Middle Initial": {
                //value: lead["MInitial"]
            //},
            //"Last Name": {
                //value: lead["LName"]
            //},
            //"Date of Birth": {
                //value: lead["DateOfBirth"]
            //},
            //"Gender": {
                //value: lead["Gender"]
            //},
            //"Ethnicity": {
                //value: lead["Ethnicity"]
            //},
            //"Home Phone": {
                //value: lead["Phone"]
            //},
            //"Mobile Phone": {
                //value: lead["PhoneMobile"]
            //},
            //"Work Phone": {
                //value: lead["PhoneOther"]
            //},
            //"Address 1": {
                //value: lead["Address"]
            //},
            //"City": {
                //value: lead["City"]
            //},
            //"Zip": {
                //value: lead["Zip"]
            //},
            //"Address 2": {
                //value: lead["Address2"]
            //},
            //"State": {
                //value: lead["State"]
            //},
            //"Country": {
                //value: lead["Country"]
            //},
            //"Email": {
                //value: lead["Email"],
                //customMethod: "setName"
            //},
            //"Marital Status": {
                //value: lead["MaritalStatus"]    
            //},
            //"SSN": {
                //value: lead["SSN"]
            //},
            //"Drivers License No": {
                //value: lead["DriversLicense"]
            //},
            //"Drivers License State": {
                //value: lead["DriversLicenseState"]
            //},
            //"Secondary Education": {
                //header: "Previous Education",
                //value: lead["SecondaryEducation"]
            //},
            //"POG": {
                //value: lead["POG"]
            //},
            //"HS Grad Date": {
                //value: lead["HSGradDate"]
            //},
            //"Highest Level of Education.": {
                //value: lead["HighestLevelEducation"]
            //},
            //"Previous College": {
               //value: lead["PreviousCollege"] 
            //},
            //"Campus": {
                //header: "Enrollment Info",
                //value: lead["Campus"]
            //},
            //"Admissions Rep": {

            //},
            //"Admissions Rep Email": {

            //},
            //"Program": {
                //header: "Select Program",
                //value: lead["Program"],
                //options: ["", "Accounting", "Finance", "English"],
                //customMethod: "setStartDate"
            //},
            //"Start Date": {
                //value: lead["StartDate"]

            //},
            //"Grad Date": {
                //value: lead["GradDate"]
            //},
            //"Weeks": {
                //type: "number",
                //value: lead["Weeks"]
            //},
            //"Student Type": {
                //value: lead["StudentType"]
            //},
            //"Session": {
                //value: lead["Session"]
            //},
            //"Contract Signed Date": {
                //value: lead["ContractSignedDate"]    
            //},
            //"Institution/Location": {
                //header: "Post Secondary Education",
                //value: lead["InstitutionLocation"]
            //},
            //"Type of Diploma/Degree": {

            //},
            //"Field of Study": {

            //},
            //"Start Data": {
                
            //},
            //"End Date": {

            //},
            //"Graduated": {
                //value: lead["Graduated"]
            //},
            //"Program Results in Diploma": {
                //header: "Additional Info",
                //type: "radio",
                //value: lead["Diploma"]
            //},
            //"Requires National Certification": {
                //type: "radio",
                //value: lead["Certification"]
            //},
            //"Funding Type": {

            //},
            //"MOU Month": {

            //},
            //"MOU Year": {

            //}
        //}
    //}
}

module.exports = TemplateManager;

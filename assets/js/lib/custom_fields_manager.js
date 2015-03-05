var CUSTOM_METHODS = require('./custom_methods.js');

var CUSTOM_OPTIONS = {
    "Program": ["", "Accounting", "Finance", "English"]
}

CustomFieldsManager = {

    fetchCustomFields: function (lead, callback) {
        // Fetches field object from server
        return $.get('/docs/123/field_names', function(data) {
            var fields = data;

            _.each(data, function (field, name) {
                // prepopulates form with diamond lead data if template field
                // name matches diamond lead column name
                fields[name] = _.extend(field, {
                    value: lead[name]
                });

                // Adds options if CUSTOM_OPTIONS has matching key
                if (CUSTOM_OPTIONS[name]) {
                    fields[name].options = CUSTOM_OPTIONS[name];
                };
                
                //Adds customMethod if CUSTOM_METHODS has matching key
                if (CUSTOM_METHODS[name]) {
                    fields[name].customMethod = CUSTOM_METHODS[name];
                };

                return field;
            });

            return callback(fields);
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

module.exports = CustomFieldsManager;
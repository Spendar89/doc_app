var PROGRAM_DATA = require('./data/program_data.js');

var CustomMethods = { 
    "Program": function (form) {
        var program = form.state.customFields.Program.value;

        if (!program) return false;

        // Updates StartDate with date options
        var startField = _.extend(form.state.customFields["StartDate"], {});
        startField.options = _.keys(PROGRAM_DATA[program]["dates"]);
        form.updateCustomField("StartDate", startField);

        // If key matches custom field name, it updates field
        var updateCustomFieldFromData = function (fieldName) {
            var field = _.extend(form.state.customFields[fieldName], {});
            if (field) {
                field.value = PROGRAM_DATA[program][fieldName];
                form.updateCustomField(fieldName, field);
            };
        }

        _.each(_.keys(PROGRAM_DATA[program]), updateCustomFieldFromData);

    },

    "StartDate": function (form) {
        var program = form.state.customFields.Program.value;
        var startDate = form.state.customFields.StartDate.value;

        if (!program || !startDate) return false;

        var gradField = _.extend(form.state.customFields["GradDate"], {});
        gradField.value = new Date(PROGRAM_DATA[program]["dates"][startDate]);
        form.updateCustomField("GradDate", gradField)
    },

    "Email": function (form) {
        var emailField = form.state.customFields.Email;
        emailField.type = "email";
        // TODO: Add email validation;
    }
}

module.exports = CustomMethods;

PROGRAM_DATA = require('./data/program_data.js');

var CustomMethods = {
    "Program": function(form) {
        var program = form.state.customFields.Program.value;

        if (!program) return false;

        // Updates StartDate with date options
        var startField = _.extend(form.state.customFields["StartDate"], {});

        $.get('/terms', {
            program_description: program
        }, function(data) {

            PROGRAM_DATA[program]["terms"] = {};

            _.each(data, function(term) {
                var startDate = term["TermBeginDate"];
                PROGRAM_DATA[program]["terms"][startDate] = term;
                startField.options = _.keys(PROGRAM_DATA[program]["terms"]);
                form.updateCustomField("StartDate", startField);
                form.updateLeadUpdate("ProgramNo", term["ProgramNo"]);
            })

            if (_.keys(PROGRAM_DATA[program]["terms"]).length === 0) {
                console.log("No terms for this program....")
                form.updateCustomField("StartDate", {
                    options: [],
                    disabled: true
                })
            } else {
                var updateCustomFieldFromData = function(fieldName) {
                    var field = _.extend(form.state.customFields[fieldName], {});
                    if (field) {
                        field.value = PROGRAM_DATA[program][fieldName];
                        form.updateCustomField(fieldName, field);
                    };
                }

                _.each(_.keys(PROGRAM_DATA[program]), updateCustomFieldFromData);

                var startDate = _.extend(form.state.customFields.StartDate, {});
                var startDateVal = form.state.customFields.StartDate.options[1]
                if (startDateVal) {
                    startDate.value = startDateVal;
                    form.updateCustomField("StartDate", startDate);
                }

                //return CustomMethods["StartDate"](form, true)
            }

        })

    },

    "StartDate": function(form, force) {
        var program = form.state.customFields.Program.value;
        var startDate = form.state.customFields.StartDate.value;
        var terms = PROGRAM_DATA[program]["terms"];

        if (!program || !startDate || !terms) return false;

        var term = terms[startDate];

        if (!term) {
            console.log("no term....")
            return false;
        } else {
            console.log("found term...")
        }
        var gradField = _.extend(form.state.customFields["GradDate"], {});
        gradField.value = new Date(term["TermEndDate"]);
        form.updateLeadUpdate("TermID", term["TermID"]);
        form.updateCustomField("GradDate", gradField)
    },

    "Email": function(form) {
        var emailField = form.state.customFields.Email;
        emailField.type = "email";
    }
}

module.exports = CustomMethods;

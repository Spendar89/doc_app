PROGRAM_DATA = require('./custom_data.json').packages;

var CustomMethods = {
    "Program": function(form) {
        var customFields = form.state.template.customFields;
        var program = customFields.Program.value;

        if (!program) return false;

        // Updates StartDate with date options
        var startField = _.extend(customFields["StartDate"], {});

        $.get('/terms', {
                program_description: program
            },
            function(data) {
                PROGRAM_DATA[program]["terms"] = {};
                _.each(
                    data,
                    function(term) {
                        var startDate = term["TermBeginDate"];
                        PROGRAM_DATA[program]["terms"][startDate] = term;
                        startField.options = _.keys(PROGRAM_DATA[program]["terms"]);
                        startField.disabled = false;
                        form.updateCustomField("StartDate", startField);
                        form.updateLeadUpdate("ProgramNo", term["ProgramNo"]);
                    }
                );

                if (_.keys(PROGRAM_DATA[program]["terms"]).length === 0) {
                    startField.options = [];
                    startField.disabled = true;
                    form.updateCustomField("StartDate", startField);
                } else {
                    _.each(
                        _.keys(PROGRAM_DATA[program]),
                        function(fieldName) {
                            var field = _.extend(customFields[fieldName], {});
                            if (field) {
                                field.value = PROGRAM_DATA[program][fieldName];
                                form.updateCustomField(fieldName, field);
                            };
                        }
                    );

                    var startFieldVal = startField.options[1];

                    if (startFieldVal) {
                        startField.value = startFieldVal;
                        startField.disabled = false;
                        form.updateCustomField("StartDate", startField);
                    };
                };
            });
    },

    "StartDate": function(form, force) {
        var customFields = form.state.template.customFields;
        var program = customFields.Program.value,
            startDate = customFields.StartDate.value,
            terms = PROGRAM_DATA[program]["terms"];

        if (!program || !startDate || !terms) return false;

        var term = terms[startDate];

        if (!term) return false;

        var gradField = _.extend(customFields["GradDate"], {});

        gradField.value = new Date(term["TermEndDate"]);
        form.updateLeadUpdate("TermID", term["TermID"]);
        form.updateCustomField("GradDate", gradField);
    },

    "Email": function(form) {
        var customFields = form.state.template.customFields;
        var emailField = customFields.Email;
        emailField.type = "email";
    }
}

module.exports = CustomMethods;

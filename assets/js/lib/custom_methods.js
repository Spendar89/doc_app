var CustomMethods = { 
    
    "Program": function (form) {
        var dates = {
            "Accounting": {"start": "4/1/2015", "grad": "6/1/2015", "weeks": 8},
            "Finance": {"start": "5/1/2015", "grad": "9/1/2015", "weeks": 27},
            "English": {"start": "3/8/2015", "grad": "11/1/2015", "weeks": 30}
        };

        var program = form.state.customFields.Program.value;

        if (!program) return false;

        var startDate = dates[program]["start"];
        var gradDate = dates[program]["grad"];
        var weeks = dates[program]["weeks"];

        var startField = _.extend(form.state.customFields["StartDate"], {});
        startField.value = new Date(startDate);
        form.updateCustomField("StartDate", startField)

        var gradField = _.extend(form.state.customFields["GradDate"], {});
        gradField.value = new Date(gradDate);
        form.updateCustomField("GradDate", gradField)

        var weeksField = _.extend(form.state.customFields["Weeks"], {});
        weeksField.value = weeks;
        form.updateCustomField("EndDate", weeksField)
    },

    "Email": function (form) {
        var nameValue;
        if (form.state.customFields.Email.value === "jakesendar@gmail.com") {
            nameValue = "Jake";
        } else {
            nameValue = "Dude";
        };
        var field = _.extend(form.state.customFields["FName"], {});
        field.value = nameValue;
        form.updateCustomField("FName", field);
    }
}

module.exports = CustomMethods;

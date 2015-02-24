var CustomMethods = { setStartDate: function (form) {
        var dates = {
            "Accounting": {"start": "4/1/2015", "grad": "6/1/2015", "weeks": 8},
            "Finance": {"start": "5/1/2015", "grad": "9/1/2015", "weeks": 27},
            "English": {"start": "3/8/2015", "grad": "11/1/2015", "weeks": 30}
        }
        var program = form.state.customFields.Program.value;

        if (!program) return false;

        var startDate = dates[program]["start"];
        var gradDate = dates[program]["grad"];
        var weeks = dates[program]["weeks"];

        var startField = _.extend(form.state.customFields["Start Date"], {});
        startField.value = new Date(startDate);
        form.updateCustomField("Start Date", startField)

        var gradField = _.extend(form.state.customFields["Grad Date"], {});
        gradField.value = new Date(gradDate);
        form.updateCustomField("Grad Date", gradField)

        var weeksField = _.extend(form.state.customFields["Weeks"], {});
        weeksField.value = weeks;
        form.updateCustomField("End Date", weeksField)
    },

    setName: function (form) {
        var nameValue;
        if (form.state.customFields.Email.value === "jakesendar@gmail.com") {
            nameValue = "Jake Sendar";
        } else {
            nameValue = "Dude Man"
        };
        var field = _.extend(form.state.customFields["First Name"], {});
        field.value = nameValue;
        form.updateCustomFieldValue("First Name", field);
    }
}

module.exports = CustomMethods;

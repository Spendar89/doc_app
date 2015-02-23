var CustomMethods = {
    setName: function (form) {
        var nameValue;
        if (form.state.customFields.Email.value === "jakesendar@gmail.com") {
            nameValue = "Jake Sendar";
        } else {
            nameValue = "Dude Man"
        };
        form.updateCustomFieldValue("Name", nameValue);
    }
}

module.exports = CustomMethods;

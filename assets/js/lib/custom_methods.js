var CustomMethods = {
    setName: function (form) {
        var nameValue;
        if (form.state.customFields.email.value === "jakesendar@gmail.com") {
            nameValue = "Jake Sendar";
        } else {
            nameValue = "Dude Man"
        };
        form.updateFieldValue("name", nameValue);
    }
}

module.exports = CustomMethods;

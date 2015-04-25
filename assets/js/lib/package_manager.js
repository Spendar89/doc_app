var PackageManager = function(packageData, customMethods) {
    this.packageData = packageData;
    this.customMethods = customMethods;
};

PackageManager.prototype = {
    setCustomFields: function(data, lead, customFields) {
        var config = this.packageData.config;
        var customMethods = this.customMethods;
        var fields = {};

        _.each(data.custom_fields, function(field, name) {
            var fieldValue;
            var header = config.headers[field.name]

            field.header = header;

            if (customFields[name]) {
                fieldValue = customFields[name].value || lead[name];
            } else {
                fieldValue = lead[name];
            };

            // name matches diamond lead column name
            fields[name] = _.extend(field, {
                value: fieldValue
            });

            if (config.customOptions[name]) {
                fields[name].options = config.customOptions[name];
            };

            //Adds customMethod if self.customMethods has matching key
            if (customMethods[name]) {
                fields[name].customMethod = customMethods[name];
            };

            if (config.customTypes[name]) {
                fields[name].type = config.customTypes[name]
            };

            if (_.include(config.disabledFields, name)) {
                fields[name].disabled = true;
            };

            return field;
        });

        return fields;
    },

    fetchTemplate: function(lead, templateId, customFields, callback) {
        var self = this;
        return $.get('/templates/' + templateId, function(data) {
            var fields = self.setCustomFields(data, lead, customFields);
            return callback(fields, data);
        });
    }

};

module.exports = PackageManager;

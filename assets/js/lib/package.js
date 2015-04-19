var Package = function(data, customMethods) {
    this.data = data;
    this.customMethods = customMethods;
};

Package.prototype = {
    fetchTemplate: function(lead, templateId, customFields, callback) {
        var self = this;
        return $.get('/templates/' + templateId, function(data) {
            var fields = {};

            // prepopulates form with diamond lead data if template field
            _.each(data.custom_fields, function(field, name) {
                var fieldValue;
                var header = self.data.headers[field.name]

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

                if (self.data.customOptions[name]) {
                    fields[name].options = self.data.customOptions[name];
                };
                
                //Adds customMethod if self.customMethods has matching key
                if (self.customMethods[name]) {
                    fields[name].customMethod = self.customMethods[name];
                };

                if (self.data.customTypes[name]) {
                    fields[name].type = self.data.customTypes[name]
                }


                if (_.include(self.data.disabledFields, name)) {
                    fields[name].disabled = true;
                };

                return field;
            });

            return callback(fields, data);
        });
    }

};

module.exports = Package;

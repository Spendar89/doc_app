var RecipientsManager = require('./../lib/recipients_manager.js');

var HelpersMixin = {
    setRecipient: function(i, key, val) {
        var templateIndex = this.state.templateIndex;
        this.cursors.templates.set([templateIndex, "recipients", i, key], val);
    },

    getRecipient: function(i, state) {
        var state = state || this.state,
            templateIndex = state.templateIndex,
            recipients = state.templates[templateIndex].recipients;

        return recipients && recipients[i]
    },

    changePage: function(p) {
        var page = window.location.href.split("&page")[0]  + "&page=" + p;
        window.location.href = page;
    },

    currentTemplate: function() {
        var i = this.state.templateIndex;

        return this.state.groupedTemplate || this.state.templates[i];
    },

    getGroupedTemplate: function() {
        var templates = this.currentGroupedTemplates();

        var groupedTemplate = _.transform(templates, function(obj, t) {
            var grouped = _.merge(obj, t);

            grouped.roles.push(t.roles);
            grouped.roles = _.flatten(grouped.roles);

            return grouped;
        });

        groupedTemplate.roles = _.uniq(groupedTemplate.roles);

        groupedTemplate.recipients = RecipientsManager
            .getRecipientsByTemplate(groupedTemplate, this.state.groupedTemplate, true);

        return groupedTemplate.customFields && _.extend({}, groupedTemplate);
    },

    currentGroupedTemplates: function() {
        return _.select(this.state.templates, "inGroup");
    },

    currentGroupedTemplateIds: function() {
        var templates = this.currentGroupedTemplates();

        return _.map(templates, "id");
    },

    currentCampusName: function(props) {
        var campus = this.state.sources.campus,
            name = campus && campus["SCI Name"],
            queryCampus = props && props.query.campus;

        return name || queryCampus;
    }

}

module.exports = HelpersMixin;

var RecipientsController = require('./../controllers/recipients_controller.js');

var RecipientsManager = {
    getIndexByTemplateAndRole: function(template, role) {
        var recipients = template && template.recipients,
            recipientIndex = false;

        recipients && _.each(recipients, function(r, i) {
            if (r.role == role) recipientIndex = i;
        });

        return recipientIndex;

    },

    setRecipient: function(i, recipient) {
        var templateIndex = this.state.templateIndex;

        this.cursors.templates.merge([
            templateIndex, 
            "recipients", 
            i
        ], recipient);
    },

    getRecipient: function(i, state) {
        var state = state || this.state,
            templateIndex = state.templateIndex,
            recipients = state.templates[templateIndex].recipients;
        return recipients && recipients[i] 
    },

    getRecipientsByTemplate: function(template, prevTemplate) {
        return _.map(template.roles, function(r, i) {
            var keepRecipient;

            if (prevTemplate) {
                _.each(prevTemplate.recipients, function(pr) {
                    if (pr.role == r) keepRecipient = pr;
                });
            };

            if (keepRecipient) return keepRecipient;

            if (template.recipients) return template.recipients[i];

            return  {role: r, name: "", email: ""};
        });

    },

    sendRecipientAuthToken: function(recipient, callback) {
        RecipientsController.sendRecipientAuthToken(recipient, callback);
    },

    fetchRecipientAuthStatus: function(recipient, callback) {
        RecipientsController.fetchRecipientAuthStatus(recipient, callback);
    },

    fetchRecipientSignature: function(recipient, template, callback) {
        var signatureId = recipient.signatureId,
            templateId = template.id;

        $.get("/templates/" + templateId + "/signatures/" + signatureId, function(url) {
            HelloSign.init(HELLO_SIGN_CLIENT_ID);

            HelloSign.open({
                url: url,
                allowCancel: true,
                skipDomainVerification: true,
                messageListener: callback
            });
        })
    },

}

module.exports = RecipientsManager;

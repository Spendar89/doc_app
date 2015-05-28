var HelpersMixin = {
    setRecipient: function(i, key, val) {
        var templateIndex = this.state.templateIndex;
        this.cursors.templates.set( [templateIndex, "recipients", i, key], val);
    },

    getRecipient: function(i, state) {
        var state = state || this.state,
            templateIndex = state.templateIndex,
            recipients = state.templates[templateIndex].recipients;
        return recipients && recipients[i] 
    }

}

module.exports = HelpersMixin;

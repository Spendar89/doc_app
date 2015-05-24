var HelpersMixin = {
    setRecipient: function(i, key, val) {
        var templateIndex = this.state.templateIndex;
        this.cursors.templates.set( [templateIndex, "recipients", i, key], val);
    },

    getRecipient: function(i) {
        var templateIndex = this.state.templateIndex;
        return this.state.templates[templateIndex].recipients[i];
    }

}

module.exports = HelpersMixin;

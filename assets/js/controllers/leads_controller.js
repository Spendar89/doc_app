var LeadsController = {
    show: function(leadId, callback) {
        return $.get('/leads/' + leadId, function(data) {
            return callback(data)
        });
    },

    DocsController: {
        index: function(lead, callback) {
            $.get('/leads/' + lead["LeadsID"] + '/docs', callback);
        }
    }

};

module.exports = LeadsController;

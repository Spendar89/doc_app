var LeadsController = {
    show: function(leadId, callback) {
        return $.get('/leads/' + leadId, function(data) {
            return callback(data)
        });
    },

    update: function(leadId, lead, callback) {
        $.ajax({
                url: "/leads/" + leadId,
                method: "PUT",
                data: {
                    lead: lead
                }
            })
            .success(callback);
    },

    DocsController: {
        index: function(lead, callback) {
            $.get('/leads/' + lead["LeadsID"] + '/docs', callback);
        }
    }

};

module.exports = LeadsController;

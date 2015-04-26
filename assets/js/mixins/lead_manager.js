var LeadManager = {
    setLoading: function(text) {
        this.setState({
            templateLoading: text
        });
    },

    setTemplateFromLead: function() {
        if (!this.state.docError) {
            this.setLoading("Loading Template ")
        };
        this.fetchTemplate(
            function(template) {
                var templates = _.extend(this.state.templates);
                templates[template.index] = template;
                this.setState({
                    template: template,
                    templates: templates,
                    templateLoading: false,
                    docUrl: false
                });
            }.bind(this)
        );
    },

    setDocsFromLead: function(callback) {
        this.setLoading("Loading Lead Documents");
        this.fetchLeadDocs(function(data) {
            this.setState({
                docs: data
            });
            if (callback) callback();
        }.bind(this))
    },

    setStateFromLead: function(lead) {
        if (lead["error"]) {
            this.setState({
                docError: lead["error"],
            });
            this.setTemplateFromLead(this.state.lead);
            return false;
        };
        this.setState({
            lead: lead,
            email: lead["Email"],
            templateLoading: "Loading Template",
            name: lead["FName"] + " " + lead["LName"]
        });
        this.setDocsFromLead(this.setTemplateFromLead);
    },

    updateLeadAndSetState: function(callback) {
        this.setLoading("Syncing Lead Data");
        this.updateLead(
            function(data){
                if (callback) return callback(data);
                this.fetchLeadAndSetState();
            }.bind(this)
        );
    },

    fetchLeadAndSetState: function() {
        this.setLoading("Loading Package");
        this.fetchLead(this.setStateFromLead);
    },

    updateLead: function(callback) {
        var leadId = this.state.lead["LeadsID"],
            lead = this.state.lead;

        $.ajax({
            url: "/leads/" + leadId,
            method: "PUT",
            data: {
                lead: lead 
            }
        })
        .success(callback);
    },

    fetchLead: function(callback) {
        var leadId = this.props.params.leadId,
            path ='/leads/' + leadId;

        return $.get(path, callback);
    },

    fetchLeadDocs: function(callback) {
        var leadId = this.state.lead["LeadsID"],
            path = '/leads/' + leadId + '/docs';

        return $.get(path, callback);
    }
};

module.exports = LeadManager;

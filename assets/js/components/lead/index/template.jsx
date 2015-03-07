var LeadsList = require('./leads_list.jsx');
var LeadsSearchBlock = require('./leads_search_block.jsx');

var fetchLeads = function (phone, callback) {
    return $.get('/leads?phone=' + phone, function (data) {
        return callback(data)
    });
};

var LeadIndexTemplate = React.createClass({

    getInitialState: function () {
        return {
            searching: false,
            leads: []
        }
    },

    handleSearchSubmit: function (phone) {
        this.setState({searching: true, leads: []});
        fetchLeads(phone, function (data) {
            this.setState({leads: data, searching: false})
        }.bind(this)); 
    },

    render: function() {
        return (
            <div className="lead-index-template container">
                <h1 className="page-header col-sm-12">Get Leads By Phone Number:</h1>
                <LeadsSearchBlock handleSubmit={this.handleSearchSubmit}/>
                <LeadsList leads={this.state.leads} searching={this.state.searching}/>
            </div>
        )

    }

});

module.exports = LeadIndexTemplate;


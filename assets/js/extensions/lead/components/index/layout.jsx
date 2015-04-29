var LeadsList = require('./leads_list.jsx');
var LeadsSearchBlock = require('./leads_search_block.jsx');

var fetchLeads = function (phone, isEmail, callback) {
    var url;
    if (isEmail) {
        url = '/leads?email='
    } else {
        url = '/leads?phone='
    }
    return $.get(url + phone, function (data) {
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

    handleSearchSubmit: function (phone, isEmail) {
        this.setState({searching: true, leads: []});
        fetchLeads(phone, isEmail, function (data) {
            this.setState({leads: data, searching: false})
        }.bind(this)); 
    },

    render: function() {
        return (
            <div className="lead-index-template container">
                <h1 className="page-header col-sm-12">Search Leads By Phone Or Email:</h1>
                <LeadsSearchBlock handleSubmit={this.handleSearchSubmit}/>
                <LeadsList leads={this.state.leads} searching={this.state.searching}/>
            </div>
        )

    }

});

module.exports = LeadIndexTemplate;


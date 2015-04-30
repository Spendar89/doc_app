var LeadsSearchInput = require('./leads_search_input.jsx');
var LeadsSearchResults = require('./leads_search_results.jsx');

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

var LeadsSearchBlock = React.createClass({

    getInitialState: function () {
        return {
            searching: false,
            leads: []
        }
    },

    handleSearchSubmit: function (phone, isEmail) {
        this.setState({searching: true, leads: []});
        fetchLeads(phone, isEmail, function (data) {
            this.setState({
                leads: data
            });
        }.bind(this)); 
    },

    handleLeadsResult: function(lead) {
        this.props.onLeadsResult(lead);
        this.setState({
            leads: []
        });
    },

    render: function() {
        return (
            <li className="leads-search-block dropdown open">
                <LeadsSearchInput handleSubmit={this.handleSearchSubmit}/>
                <LeadsSearchResults onLeadsResult={this.handleLeadsResult} leads={this.state.leads} />
            </li>
        )

    }

});

module.exports = LeadsSearchBlock;


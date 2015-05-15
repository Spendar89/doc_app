var LeadsSearchInput = require('./leads_search_input.jsx');
var LeadsSearchResults = require('./leads_search_results.jsx');

var LeadsSearchBlock = React.createClass({

    render: function() {
        return (
            <div className="leads-search-block col-sm-12">
                <LeadsSearchInput input={this.props.leadsSearchInput} handleInput={this.props.onLeadsSearchInput} handleSubmit={this.props.onLeadsSearch}/>
            </div>
        )

    }

});

module.exports = LeadsSearchBlock;


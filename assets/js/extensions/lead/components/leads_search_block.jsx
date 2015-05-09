var LeadsSearchInput = require('./leads_search_input.jsx');
var LeadsSearchResults = require('./leads_search_results.jsx');

var LeadsSearchBlock = React.createClass({

    render: function() {
        var getClassName = function() {
            return this.props.vId && !this.props.leadsSearchInput
                ? " leads-default-search" 
                : "leads-welcome-search";
        }.bind(this);
        return (
            <li className="leads-search-block dropdown open col-sm-8 col-sm-offset-4">
                <LeadsSearchInput className={getClassName()} input={this.props.leadsSearchInput} handleInput={this.props.onLeadsSearchInput} handleSubmit={this.props.onLeadsSearch}/>
            </li>
        )

    }

});

module.exports = LeadsSearchBlock;


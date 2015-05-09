var LeadsSearchInput = require('./leads_search_input.jsx');
var LeadsSearchResults = require('./leads_search_results.jsx');

var LeadsWelcomeOverlay = React.createClass({
    render: function() {
        var inputClassName = "col-sm-4 col-sm-offset-4 leads-welcome-search";

        var getStyle = function() {
            if ( this.props.vId && !this.props.leadsSearchInput) {
                return {
                    display: "none"
                }
            }
        }.bind(this);

        var getHeaderText = function() {
            if (this.props.isLeadsSearching) {
                return (
                    <div className="loader-div welcome-loader-div">
                        <h1 className="loader-text">Searching for Leads</h1>
                        <Spinner />
                    </div>
                );
            };

            if (this.props.leads[0]) {
                return (
                    <h1 className="col-sm-12 header-text">Search Results</h1>
                )
            };
            
            if (!this.props.vId) {
                return (
                    <h1 className="col-sm-12 header-text">
                        To Start, Search for a Lead by Email or Phone Number    
                    </h1>
                );
            };
            
            return (
                <h1 className="col-sm-12 header-text">
                    Leads Search
                </h1>
            );
        };

        var getLoaderStyle = function() {
            if (!this.props.isLeadsSearching) {
                return {
                    display: "none"
                }
            }

        };

        return (
            <div className="leads-welcome-overlay-div col-sm-12" style={getStyle()}>
                <div className="leads-welcome-inner container">
                    <div className="leads-welcome-header col-sm-12">
                        <div className="col-sm-12">
                            {getHeaderText.call(this)}
                        </div>
                    </div>
                    <div className="leads-welcome-body col-sm-12">
                        <LeadsSearchResults onLeadsResult={this.props.onLeadsResult} leads={this.props.leads} />
                    </div>
                </div>
            </div>
        );

    }
});

module.exports = LeadsWelcomeOverlay;

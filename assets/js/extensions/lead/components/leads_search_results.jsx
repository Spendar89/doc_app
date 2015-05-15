var LeadsSearchResults = React.createClass({

    handleClick: function(lead) {
        //window.location.href = "#/leads/" + lead.id + "?campus=" + lead["college/campus_of_interest"];
this.props.onLeadsResult(lead);
    },

    renderLeadsResults: function () {
       return this.props.leads.map(function (lead, i) {
           return (
               <li key={i}>
                   <a className="col-sm-12 lead-results-row" onClick={this.handleClick.bind(this, lead)}>
                       <p>
                           <div className="col-sm-4 lead-results-field-value">{lead.first_name} {lead.last_name}</div>
                           <div className="col-sm-4 lead-results-field-value">{lead["college/campus_of_interest"]}</div>
                           <div className="col-sm-4 lead-results-field-value">{lead.id}</div>
                       </p>
                   </a>
               </li>
           )
        }, this)
    },


    render: function () {

        var getStyle = function () {
            var display = this.props.leads.length > 0
                ? "block"
                : "none";

            return {
                display: display 
            };
        }.bind(this);

        return (
            <div className="lead-search-results-div row">
                {
                    this.props.isLeadsSearching 
                        ? (
                            <div className="loader-div col-sm-12">
                                <h3 className="loader-text col-sm-12">Searching for Leads</h3>
                                <div className="col-sm-12">
                                    <Spinner />
                                </div>
                            </div>
                        )
                        : (
                            <ul  className="col-sm-12" style={getStyle()}> 
                                   <h3 className="col-sm-12 lead-results-headers">
                                       <small>
                                           <div className="col-sm-4 lead-results-field-header"><b>Name:</b></div>
                                           <div className="col-sm-4 lead-results-field-header"><b>Campus:</b></div>
                                           <div className="col-sm-4 lead-results-field-header"><b>Velocify ID:</b></div>
                                       </small>
                                   </h3>
                                {this.renderLeadsResults()}
                            </ul>

                        )
                
                
                } 
            </div>
        )

    }

})

module.exports = LeadsSearchResults;

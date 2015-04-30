var LeadsSearchResults = React.createClass({

    handleClick: function(lead) {
        //window.location.href = "#/leads/" + lead.id + "?campus=" + lead["college/campus_of_interest"];
this.props.onLeadsResult(lead);
    },

    renderLeads: function () {
       return this.props.leads.map(function (lead, i) {
           return (
               <li key={i}>
                   <a className="col-sm-12 lead-results-row" onClick={this.handleClick.bind(this, lead)}>
                       <div className="col-sm-6 lead-results-field-value">{lead.first_name} {lead.last_name}</div>
                       <div className="col-sm-6 lead-results-field-value">{lead["college/campus_of_interest"]}</div>
                   </a>
               </li>
           )
        }, this)
    },


    render: function () {

        var getTableStyle = function () {
            var display = this.props.leads.length > 0
                ? "block"
                : "none";

            return {
                display: display 
            };
        }.bind(this);

        return (
            <ul className="dropdown-menu" style={getTableStyle()}> 
                {this.renderLeads()}
            </ul>
        )

    }

})

module.exports = LeadsSearchResults;

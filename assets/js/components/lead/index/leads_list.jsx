var LeadsList = React.createClass({

    handleClick: function(lead) {
        window.location.href = "#/leads/" + lead.id;
        //this.props.handleLead(lead);
    },

    renderLeads: function () {
       return this.props.leads.map(function (lead) {
           return (
                    <tr className="lead-results-row" onClick={this.handleClick.bind(this, lead)}>
                           <td className="lead-results-field"> 
                               <span className="lead-results-field-value">{lead.first_name} {lead.last_name}</span>
                           </td>
                           <td className="lead-results-field"> 
                               <span className="lead-results-field-value">{lead.email_1}</span>
                           </td>
                           <td className="lead-results-field"> 
                               <span className="lead-results-field-value">{lead.id}</span>
                           </td>
                   </tr>
           )
        }, this)
    },

    render: function () {
        return (
            <div className="leads-list col-sm-12">
               <table className="lead-div table table-striped table-bordered table-striped">
                   <tr>
                       <th>Name</th>
                       <th>Email</th>
                       <th>Id</th>
                   </tr>
                    {this.renderLeads()}
                </table>
            </div>
        )
    }

})

module.exports = LeadsList;

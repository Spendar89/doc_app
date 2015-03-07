var LeadsList = React.createClass({

    handleClick: function(lead) {
        window.location.href = "#/leads/" + lead.id;
    },

    renderLeads: function () {
       return this.props.leads.map(function (lead, i) {
           return (
                    <tr key={i} className="lead-results-row" onClick={this.handleClick.bind(this, lead)}>
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
        var searchingStyle={
            visibility: (this.props.searching ? "visible" : "hidden")
        };
        var tableStyle={
            visibility: (this.props.leads.length > 0 ? "visible" : "hidden")
        };

        return (
            <div className="leads-list col-sm-12">
                <div className="ajax-loader" style={searchingStyle}></div>
                <table style={tableStyle} className="lead-div table table-hover table-bordered">
                    <tbody>
                   <tr>
                       <th>Name</th>
                       <th>Email</th>
                       <th>Id</th>
                   </tr>
                   {this.renderLeads()}
                   </tbody>
                </table>
            </div>
        )
    }

})

module.exports = LeadsList;

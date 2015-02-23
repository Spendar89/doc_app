var LeadBlock = require('./lead_block.jsx')

var LeadIndexTemplate = React.createClass({

    getInitialState: function () {
        return {
            lead: false
        }
    },

    handleLead: function (lead) {
        console.log("LEAD:", lead)
        this.setState({lead: lead})
    },

    render: function() {
        return (
            <div className="app-template-div container">
                <LeadBlock handleLead={this.handleLead}/>
            </div>
        )

    }

});

module.exports = LeadIndexTemplate;


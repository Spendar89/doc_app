
var LeadInput = React.createClass({
    handleChange: function (e) {
        //this.props.updateFieldValue(this.props.fieldName, 
                                    //e.target.value, 
                                    //this.props.customMethod)
    },

    render: function() {
        return (
            <div className="lead-input form-group">
                <input  onChange={this.handleChange} 
                        className="lead-block-input form-control" 
                        type="text"/>
            </div>
        );

    }

});

module.exports = LeadInput;

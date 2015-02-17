var DocInput = React.createClass({
    handleChange: function (e) {
        this.props.updateFieldValue(this.props.fieldName, e.target.value)
    },

    render: function() {
        return (
            <div className="doc-input form-group">
                <label className="form-label">
                    {this.props.fieldName}
                </label>
                <input  onChange={this.handleChange} 
                        value={this.props.fieldValue} 
                        className="doc-block-input form-control" 
                        type="text"/>
            </div>
        );

    }

});

module.exports = DocInput;

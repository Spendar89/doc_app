var DocInput = React.createClass({
    handleChange: function (e) {
        var field = _.extend(this.props.field, {})
        field.value = e.target.value;
        console.log(field)
        this.props.updateField(this.props.fieldName, field);
        //this.props.updateFieldValue(this.props.fieldName, 
                                    //e.target.value, 
                                    //this.props.customMethod)
    },

    renderInput: function () {
        var renderOptions = function (option) {
            return <option value={option}> {option} </option>

        };
        if (this.props.field.options) {
            return (
                <select className="doc-block-input form-control" onChange={this.handleChange} value={this.props.field.value}>
                    {_.map(this.props.field.options, renderOptions)}
                </select>
            )
        } else if (this.props.field.type === "radio") {
            return (
                <div className="radio-group col-sm-12">
                    <div className="radio">
                        <label>
                            <input  onChange={this.handleChange}
                                    value={true}
                                    checked={this.props.field.value === "true"}
                                    type="radio" />
                            True
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input  onChange={this.handleChange}
                                    checked={this.props.field.value === "false"}
                                    value={false}
                                    type="radio" />
                            False
                        </label>
                    </div>
                </div>
            )
        } else {
            return (
                <input  onChange={this.handleChange} 
                    value={this.props.field.value} 
                    className="doc-block-input form-control" 
                    type={this.props.field.type || "text"} />
            )
        }

    },

    render: function() {
        return (
            <div className="doc-input form-group">
                <label className="form-label">
                    {this.props.fieldName}
                </label>
                {this.renderInput()}
            </div>
        );

    }

});

module.exports = DocInput;

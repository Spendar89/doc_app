var DocInput = React.createClass({
    handleChange: function (e) {
        var field = _.extend(this.props.field, {})
        field.value = e.target.value;
        this.props.updateField(this.props.fieldName, field);
    },

    renderInput: function () {
        var renderOptions = function (option) {
            return <option value={option}> {option} </option>

        };
        if (this.props.field.options) {
            return (
                <div className="select">
                    <label className="form-label">
                        {this.props.fieldName}
                    </label>
                    <select className="doc-block-input form-control" 
                            disabled={this.props.field.disabled}
                            onChange={this.handleChange} value={this.props.field.value}>
                        {_.map(this.props.field.options, renderOptions)}
                    </select>
                </div>
            )
        } else if (this.props.field.type === "radio") {
            return (
                <div className="radio-group col-sm-12">
                    <label className="form-label">
                        {this.props.fieldName}
                    </label>
                    <div className="radio">
                        <label>
                            <input  disabled={this.props.field.disabled}
                                    onChange={this.handleChange}
                                    value={true}
                                    checked={this.props.field.value === "true"}
                                    type="radio" />
                            True
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input  disabled={this.props.field.disabled}
                                    onChange={this.handleChange}
                                    checked={this.props.field.value === "false"}
                                    value={false}
                                    type="radio" />
                            False
                        </label>
                    </div>
                </div>
            )
        } else if (this.props.field.type === "checkbox") {
            return (
                <div className="checkbox">
                    <label>
                        <input  disabled={this.props.field.disabled}
                                onChange={this.handleChange}
                                checked={this.props.field.value}
                                value={this.props.field.value}
                                type="checkbox" />
                        {this.props.fieldName}
                    </label>
                </div>
            )
        } else {
            return (
                <div className="default-input">
                    <label className="form-label">
                        {this.props.fieldName}
                    </label>
                    <input  disabled={this.props.field.disabled}
                            onChange={this.handleChange} 
                            value={this.props.field.value} 
                            className="doc-block-input form-control" 
                            type={this.props.field.type || "text"} />
                </div>
            )
        }

    },

    render: function() {
        return (
            <div className="doc-input form-group">
                {this.renderInput()}
            </div>
        );

    }

});

module.exports = DocInput;

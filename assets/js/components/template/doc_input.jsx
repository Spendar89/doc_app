var DocInput = React.createClass({

    handleChange: function (e) {
        var field = _.extend(this.props.field, {});
        if (field.type === "checkbox") {
            field.value = !field.value;
        } else if (field.type === "date") {
            field.value = Moment(e).format("MM-DD-YYYY");
        } else {
            field.value = e.target.value;
        };
        this.props.onCustomFieldUpdate(this.props.fieldName, field);
    },

    renderDocOption: function(value, i) {
        return <option key={i} value={value}>value</option>
    },

    renderInput: function () {
        if (this.props.field.options) {
            var options = _.uniq(this.props.field.options.concat("Select One")).reverse()
            return (
                <div className="select">
                    {this.renderLabel()}
                    <select className="doc-block-input form-control" 
                            disabled={this.props.field.disabled}
                            onChange={this.handleChange} value={this.props.field.value}>
                        {_.map(options, this.renderDocOption)}
                    </select>
                </div>
            )
        } else if (this.props.field.type === "radio") {
            return (
                <div className="radio-group col-sm-12">
                    {this.renderLabel()}
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
                                checked={this.props.field.value === true}
                                value={this.props.field.value}
                                type="checkbox" />
                        {this.props.fieldName}
                    </label>
                </div>
            )
        } else if (this.props.field.type === "textarea") {
            return (
                <div className="textarea">
                    {this.renderLabel()}
                    <textarea   disabled={this.props.field.disabled}
                                onChange={this.handleChange} 
                                rows="4" 
                                value={this.props.field.value} 
                                className="doc-block-input form-control" />
                </div>
            )
        } else if (this.props.field.type === "date") {
            var format = "MM-DD-YYYY";
            var val = this.props.field.value;
            var date = val && Moment(val, "MM-DD-YYYY");

            return (
                <div className="date-picker">
                    {this.renderLabel()}
                    <DatePicker 
                        className="form-control"
                        dateFormat={format}
                        placeholderText={format}
                        selected={date} 
                        onChange={this.handleChange} />
                </div>
            )

        } else {
            var val = this.props.field.value;
            val = val === 0  || val === "0" ? "N/A" : val;
            return (
                <div className="default-input">
                    {this.renderLabel()}
                    <input  disabled={this.props.field.disabled}
                            onChange={this.handleChange} 
                            value={val} 
                            className="doc-block-input form-control" 
                            type={this.props.field.type || "text"} />
                </div>
            )
        }
    },

    renderLabel: function() {
        var name = this.props.fieldName,
            className = "form-label";

        if (this.props.field.optional) {
            name += " (optional)";
            className += " optional-label";
        };

        return (
            <label className={className}>
                {name}
            </label>
        ) 
    },

    customMethodClass: function() {
        var customMethod = this.props.field.customMethod;
        return customMethod
            ? "custom-method"
            : "no-custom-method";
    },

    validationClass: function() {
        var field = this.props.field;
        return !this.props.isValidField(field)
            ? "invalid doc-input form-group"
            : "valid doc-input form-group";
    },

    render: function() {
        var gridClass = this.props.field.type === "checkbox" ? " col-sm-4 " : " col-sm-12 ",
            fieldDisplay = this.props.field.display,
            inputStyle = {display: fieldDisplay};
        
        return (
            <div style={inputStyle} className={this.validationClass() + gridClass + this.customMethodClass()}>
                {this.renderInput()}
            </div>
        );

    }

});

module.exports = DocInput;

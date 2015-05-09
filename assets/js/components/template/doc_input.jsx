var DocOption = require('./doc_option.jsx');

var DocInput = React.createClass({

    handleChange: function (e) {
        var field = _.extend(this.props.field, {});
        if (field.type === "checkbox") {
            field.value = field.value === true
                ? false
                : true;
        } else {
            field.value = e.target.value;
        };
        this.callCustomMethod();
        this.props.updateField(this.props.fieldName, field);
    },

    callCustomMethod: function() {
        var customMethod = this.props.field.customMethod;
        if (customMethod)
            this.props.callCustomMethod(customMethod)
    },

    renderDocOption: function(option, i) {
        return <DocOption   key={i} 
                            value={option} 
                            handleChange={this.handleChange} 
                            callCustomMethod={this.callCustomMethod} />
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
        } else {
            return (
                <div className="default-input">
                    {this.renderLabel()}
                    <input  disabled={this.props.field.disabled}
                            onChange={this.handleChange} 
                            value={this.props.field.value} 
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
        return !this.props.field.optional && this.props.field.value == undefined
            ? "invalid doc-input form-group"
            : "valid doc-input form-group";
    },

    render: function() {
        return (
            <div className={this.validationClass() + " " + this.customMethodClass()}>
                {this.renderInput()}
            </div>
        );

    }

});

module.exports = DocInput;

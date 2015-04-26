var TemplateInput = React.createClass({

    renderTemplateOption: function(template, i) {
        return <option key={template.id} value={i}>{template.title}</option>
    },

    render: function () {
        return (
            <div className="block-div col-sm-12">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Switch Your Template: </h4>
                    </div>
                    <div className="block-body">
                        <label><b>Current Package: {this.props.packageName}</b></label>
                        <p><i>Enter a different HelloSign Template ID to Update the Form Fields</i></p>

                        <select className=" form-control" 
                                disabled={this.props.templateLoading}
                                onChange={this.props.onChange} 
                                selected={this.props.template.id}>
                            {_.map(this.props.templates, this.renderTemplateOption)}
                        </select>
                    </div>
                    
                </div>
            </div>
        )

    }
});

module.exports = TemplateInput;

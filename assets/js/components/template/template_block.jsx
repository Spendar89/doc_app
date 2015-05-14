var TemplateBlock = React.createClass({

    renderTemplateOption: function(template, i) {
        return <option key={template.id} value={i}>{template.title}</option>
    },

    render: function () {
        return (
            <div>
                <select className="form-control" 
                    disabled={this.props.templateLoading}
                    onChange={this.props.onChange} 
                    selected={this.props.template.id}>
                    {_.map(this.props.templates, this.renderTemplateOption)}
                </select>
            </div>
        )

    }
});

module.exports = TemplateBlock;

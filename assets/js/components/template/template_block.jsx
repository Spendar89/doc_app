var TemplateBlock = React.createClass({

    renderTemplateOption: function(template, i) {
        return <option key={i} value={i}>{template.title}</option>
    },


    render: function () {
        var handlePrev = _.partial(this.props.onCycle, true),
            handleNext = _.partial(this.props.onCycle, false)

        var renderTemplateForGroup = function(template, i) {
            return (
                <div key={i} className="template-for-group-div">
                    <div className="checkbox">
                        <label>
                            <input  type="checkbox" value={template.inGroup} 
                                checked={template.inGroup} onChange={_.partial(this.props.onTemplateInGroup, i)} />
                            {template.title}
                        </label>
                    </div>
                </div>
            )

        };

        var renderTemplatesForGroup = function() {
            return _.map(this.props.templates, renderTemplateForGroup.bind(this))
        };

        return (
            <div>
                <div className="cycle-templates-div">
                    <div className="col-sm-6 cycle-btn-div">
                        <a disabled={this.props.groupTemplates} className="btn btn-default btn-block" onClick={handlePrev}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </a>
                    </div>
                    <div className="col-sm-6 cycle-btn-div">
                        <a disabled={this.props.groupTemplates} className="btn btn-default btn-block" onClick={handleNext}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <label>Current Template</label>
                <select className="form-control" 
                    disabled={this.props.templateLoading["template"] || this.props.groupTemplates}
                    onChange={this.props.onChange} 
                    value={this.props.templateIndex}>
                    {_.map(this.props.templates, this.renderTemplateOption)}
                </select>
                <div className="group-templates-div">
                    <div className="checkbox group-templates-checkbox">
                        <h4>
                            <label>
                                <input className="group-templates-input" disabled={this.props.templateLoading["template"]} type="checkbox" value={this.props.groupTemplates} 
                                    checked={this.props.groupTemplates} onChange={this.props.onGroupTemplates} />
                                <b>Group Templates</b>
                            </label>
                        </h4>
                    </div>

                    {
                        this.props.groupTemplates
                        ? renderTemplatesForGroup.call(this)
                        : null
                    }
                </div>
            </div>
        )

    }
});

module.exports = TemplateBlock;

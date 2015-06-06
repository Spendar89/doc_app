var TemplateBlock = React.createClass({

    renderTemplateOption: function(template, i) {
        return <option key={i} value={i}>{template.title}</option>
    },

    render: function () {
        var handlePrev = _.partial(this.props.onCycle, true),
            handleNext = _.partial(this.props.onCycle, false)

        return (
            <div>
                <div className="group-templates-div">
                    <div className="checkbox">
                        <label>
                            <input  type="checkbox" value={this.props.groupTemplates} 
                                checked={this.props.groupTemplates} onChange={this.props.onGroupTemplates} />
                            Group Templates When Generating Form
                        </label>
                    </div>
                </div>
                <div className="cycle-templates-div">
                    <div className="col-sm-6 cycle-btn-div">
                        <a className="btn btn-default btn-block" onClick={handlePrev}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </a>
                    </div>
                    <div className="col-sm-6 cycle-btn-div">
                        <a className="btn btn-default btn-block" onClick={handleNext}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <label>Current Template</label>
                <select className="form-control" 
                    disabled={this.props.templateLoading["template"]}
                    onChange={this.props.onChange} 
                    value={this.props.templateIndex}>
                    {_.map(this.props.templates, this.renderTemplateOption)}
                </select>
            </div>
        )

    }
});

module.exports = TemplateBlock;

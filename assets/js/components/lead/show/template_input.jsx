var TemplateInput = React.createClass({

    render: function () {
        return (
            <div className="col-sm-12">
                <div className="form-group">
                    <h4 className="control-label">Switch Your Template: </h4>
                    <p><i>Enter a different HelloSign Template ID to Update the Form Fields</i></p>
                    <input className="form-control" value={this.props.templateId} onChange={this.props.onChange} />
                </div>
                <div className="form-group">
                    <input type="submit" className="form-control btn btn-success"onClick={this.props.onSubmit} value="Update Template"/>
                </div>
            </div>
        )

    }
});

module.exports = TemplateInput;

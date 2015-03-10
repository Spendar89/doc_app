var LeadInputs = React.createClass({

    render: function () {
        return (
            <div className="col-sm-12">
                <div className="form-group">
                    <h4 className="control-label">Enter the Recipient Info: </h4>
                    <p><i>You can specify the email address that will receive the signature request and the name of the recipient</i></p>
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input className="form-control" value={this.props.name} onChange={this.props.onNameChange} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input className="form-control" value={this.props.email} onChange={this.props.onEmailChange} />
                </div>
            </div>
        )

    }
});

module.exports = LeadInputs;

var LeadInputs = React.createClass({

    render: function () {
        return (
            <div className="block-div col-sm-12">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Enter the Recipient Info: </h4>
                    </div>
                    <div className="block-body">
                        <p><i>You can specify the email address that will receive the signature request and the name of the recipient</i></p>
                        <div className="form-group">
                            <label>Name:</label>
                            <input className="form-control" value={this.props.recipient.name} onChange={this.props.onNameChange} />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input className="form-control" value={this.props.recipient.email} onChange={this.props.onEmailChange} />
                        </div>
                    </div>
                </div>
            </div>
        )

    }
});

module.exports = LeadInputs;

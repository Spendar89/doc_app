var RecipientsBlock = React.createClass({

    renderRecipient: function(recipient, i) {
        return (
            <div key={i}>
                <div className="col-sm-6">
                    <div className="form-group">
                        <label>{recipient.role} Name:</label>
                        <input className="form-control" value={recipient.name} onChange={_.partial(this.props.onRecipientChange, i, "name")} />
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <label>{recipient.role} Email:</label>
                        <input className="form-control" value={recipient.email} onChange={_.partial(this.props.onRecipientChange, i, "email")} />
                    </div>
                </div>
            </div>
        );
    },

    render: function () {
        return (
            <div className="recipients-block row">
                {_.map(this.props.recipients, this.renderRecipient)}
            </div>
        )
    }
});

module.exports = RecipientsBlock; 

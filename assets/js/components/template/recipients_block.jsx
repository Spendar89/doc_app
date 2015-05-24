var RecipientsBlock = React.createClass({

    renderRecipient: function(recipient, i) {
        var iconStyle = "glyphicon glyphicon-envelope";
        var buttonStyle = "btn btn-primary btn-block";

        if (recipient.authorized) {
            iconStyle = "glyphicon glyphicon-ok";
            buttonStyle = "btn btn-success btn-block";
        };

        if (recipient.authError) {
            iconStyle = "glyphicon glyphicon-exclamation-sign";
            buttonStyle = "btn btn-danger btn-block";
        };

        return (
             recipient.authId && !recipient.authorized
                ? (
                    <div key={i} className="auth-token-block">
                        <div className="col-sm-12">
                            <label>{recipient.role} Confirmation Code:</label>
                            <div className="form-group row">
                                <div className="col-sm-7">
                                    <input  className="form-control" 
                                            type="text" 
                                            onChange={_.partial(this.props.onAuthTokenChange, i)} 
                                            value={recipient.authToken} />
                                </div>
                                <div className="col-sm-5">
                                    <input  className={buttonStyle} 
                                            type="submit" 
                                            onClick={_.partial(this.props.onAuthTokenSubmit, i)} 
                                            value="Submit Code"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <div key={i}>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>{recipient.role} Name:</label>
                                <input  disabled={recipient.authorized} 
                                        className="form-control" 
                                        value={recipient.name} 
                                        onChange={_.partial(this.props.onRecipientChange, i, "name")} />
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label> {recipient.role} Email: </label>
                                <input  disabled={recipient.authorized} 
                                        className="form-control" 
                                        value={recipient.email} 
                                        onChange={_.partial(this.props.onRecipientChange, i, "email")} />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group auth-div">
                                <button disabled={recipient.authorized} 
                                        className={buttonStyle}
                                        onClick={_.partial(this.props.onAuthTokenSend, i)}>
                                    <span className={iconStyle} />
                                </button> 
                            </div>
                        </div>
                    </div>
                )
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

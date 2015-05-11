var SharedBlock = React.createClass({

    render: function () {
        return (
            <div className="block-div col-sm-12" id="templateBlock">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">
                            {this.props.blockHeader}
                        </h4>
                    </div>
                    <div className="block-body">
                        {this.props.blockBody}
                    </div>
                </div>
            </div>
        )

    }


});

module.exports = SharedBlock;

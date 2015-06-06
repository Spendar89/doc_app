var SharedBlock = React.createClass({

    render: function () {
        return (
            <div className="block-div col-sm-12"> 
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">
                            {this.props.blockHeader}
                        </h4>
                    </div>
                    <div className="block-description">
                        <i>{this.props.blockDescription}</i>
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

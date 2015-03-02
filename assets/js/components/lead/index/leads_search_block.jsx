var LeadsSearchBlock = React.createClass({
    setInitialState: function () {
        return {
            phone: ""
        }
    },

    handleChange: function (e) {
        e.preventDefault();
        this.setState({phone: e.target.value})
    },

    handleClick: function (e) {
        e.preventDefault();
        this.props.handleSubmit(this.state.phone);
    },

    render: function() {
        return (
            <div className="leads-search-block form-group row col-sm-12">
                <div className="col-sm-8">
                    <input  onChange={this.handleChange} 
                            className="lead-block-input form-control" 
                            type="text"/>
                </div>
                <div className="col-sm-4">
                    <input  type="submit"
                            onClick={this.handleClick} 
                            className="btn btn-submit col-sm-12" />
                </div>
            </div>
        );

    }

});

module.exports = LeadsSearchBlock;

var LeadsSearchBlock = React.createClass({
    getInitialState: function () {
        return {
            phone: "",
            isValid: false
        }
    },

    handleChange: function (e) {
        e.preventDefault();
        var phone = e.target.value;
        var isValid = this.handleValidation(phone) ? true : false;
        this.setState({phone: phone, isValid: isValid});
    },

    handleValidation: function (phoneNumber) {
        var reg = /(\+*\d{1,})*([ |\( ])*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/;
        return phoneNumber.match(reg);
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
                            type="tel" />
                </div>
                <div className="col-sm-4">
                    <input  type="submit"
                            disabled={!this.state.isValid}
                            onClick={this.handleClick} 
                            className="btn btn-submit col-sm-12" />
                </div>
            </div>
        );

    }

});

module.exports = LeadsSearchBlock;

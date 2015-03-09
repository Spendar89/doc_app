var LeadsSearchBlock = React.createClass({
    getInitialState: function () {
        return {
            input: "",
            isEmail: false,
            isValid: false
        }
    },

    handleChange: function (e) {
        e.preventDefault();
        var input = e.target.value;
        var isEmail = this.handleEmailValidation(input) ? true : false;
        var isPhone = this.handlePhoneValidation(input) ? true : false;
        var isValid = (isEmail || isPhone)  ? true : false;
        this.setState({input: input, isValid: isValid, isEmail: isEmail});
    },

    handleEmailValidation: function (input) {
        var emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return input.match(emailReg);
    },

    handlePhoneValidation: function (input) {
        var phoneReg = /(\+*\d{1,})*([ |\( ])*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/;
        return input.match(phoneReg);
    },

    handleClick: function (e) {
        e.preventDefault();
        this.props.handleSubmit(this.state.input, this.state.isEmail);
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

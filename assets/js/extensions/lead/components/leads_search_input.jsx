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
            <form className="navbar-form navbar-right" role="search">
                <div className="form-group">
                    <input  onChange={this.handleChange}  
                            type="tel" 
                            className="form-control" 
                            placeholder="Search For Leads by Email or Phone Number"/>
                </div>
                <button className="btn btn-default"
                        disabled={!this.state.isValid}
                        onClick={this.handleClick} >
                    Search
                </button>
            </form>
        );

    }

});

module.exports = LeadsSearchBlock;

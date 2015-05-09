var LeadsSearchBlock = React.createClass({
    getInitialState: function () {
        return {
            isEmail: false,
            isValid: false
        }
    },

    handleChange: function (e) {
        e.preventDefault();
        var input = e.target.value;
        this.props.handleInput(input);
        var isEmail = this.handleEmailValidation(input) ? true : false;
        var isPhone = this.handlePhoneValidation(input) ? true : false;
        var isValid = (isEmail || isPhone)  ? true : false;
        this.setState({isValid: isValid, isEmail: isEmail});
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
        this.props.handleSubmit(this.props.input, this.state.isEmail);
    },

    render: function() {
        return (
            <form className={this.props.className} role="search">
                <div className="form-group col-sm-9">
                    <input  onChange={this.handleChange}  
                            type="text" 
                            value={this.props.input}
                            className="form-control" 
                            placeholder="Search For Leads by Email or Phone Number"/>
                </div>
                <button className="btn btn-default col-sm-3"
                        disabled={!this.state.isValid}
                        onClick={this.handleClick} >
                    Search
                </button>
            </form>
        );

    }

});

module.exports = LeadsSearchBlock;

var LeadsSearchInput = React.createClass({
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

        if (this.props.lead) {
            window.location.href = "/";
        } else {
            this.props.handleSubmit(this.props.input, this.state.isEmail);
        }
    },

    render: function() {
        var lead = this.props.lead;
        var fullName = lead && lead["FName"] + " " + lead["LName"];

        var input = 
            <input  onChange={this.handleChange}  
                    type="text" 
                    value={this.props.input}
                    className="form-control" 
                    placeholder="Search by Email or Phone Number"/>;

        var leadDiv = 
            <h4 style={{marginTop: 0, color: "rgb(68, 168, 68)", fontWeight: "normal"}}>
                Selected: {fullName}
            </h4>

        var btnClearClass = "glyphicon glyphicon-remove";
        var btnSearchClass = "glyphicon glyphicon-search";
        var btnColorClass = this.props.lead ? "btn-danger" : "btn-default";

        return (
            <form className="leads-default-search row" role="search">
                <div className="form-group col-sm-9 row">
                    {this.props.lead ? leadDiv : input}
                </div>
                <button className={"btn col-sm-3 pull-right " + btnColorClass}
                        disabled={!this.props.lead && !this.state.isValid}
                        onClick={this.handleClick} >
                    <span className={this.props.lead ? btnClearClass : btnSearchClass}></span>
                </button>
            </form>
        );

    }

});

module.exports = LeadsSearchInput;

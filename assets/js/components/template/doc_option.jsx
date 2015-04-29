var DocOption = React.createClass({
    //componentDidMount: function() {
        //if(this.props.value) {
            //this.props.handleChange({target: {value: this.props.value}})
        //}
    //},

    render: function() {
        return <option value={this.props.value}> {this.props.value} </option>
    }
})

module.exports = DocOption;

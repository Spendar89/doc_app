var ProgramBlock = React.createClass({

    renderProgramOption: function(program, i) {
        return <option key={i} value={i}>{program["ProgramName"]}</option>
    },

    renderProgramTermOption: function(term, i) {
        return <option key={i} value={i}>{term["TermBeginDate"]} - {term["TermEndDate"]}</option>
    },

    render: function() {
        return (
            <div>
                <p><i>Select a program and a term from the provided options:</i></p>

                <div className="form-group">
                    <label className="control-label">Program</label>
                    <select className="form-control" 
                            disabled={!this.props.programs}
                            onChange={this.props.onProgramIndexChange} 
                            selected={this.props.programIndex}>
                        {_.map(this.props.programs, this.renderProgramOption)}
                    </select>
                </div>

                <div className="form-group">
                    <label className="control-label">Term</label>
                    <select className="col-sm-12 form-control"
                            onChange={this.props.onProgramTermIndexChange}
                            selected={this.props.programTermIndex} >
                        {_.map(this.props.programTerms, this.renderProgramTermOption)}
                    </select>
                </div>
            </div>

        )

    }

});

module.exports = ProgramBlock;

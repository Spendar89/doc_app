var ProgramBlock = React.createClass({

    renderProgramOption: function(program, i) {
        return <option key={i} value={i}>{program["Name"]}</option>
    },

    renderProgramTermOption: function(term, i) {
        var beginDate = new Date(term["TermBeginDate"]),
            endDate = new Date(term["TermEndDate"]),
            beginStr = beginDate && beginDate.toLocaleDateString(),
            endStr = endDate && endDate.toLocaleDateString();

        return <option key={i} value={i}>{beginStr} - {endStr}</option>
    },

    render: function() {
        var program = this.props.program,
            programTerms = program && program.terms;

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
                            disabled={!programTerms || !programTerms[0]}
                            onChange={this.props.onProgramTermIndexChange}
                            selected={this.props.programTermIndex} >
                        {_.map(programTerms, this.renderProgramTermOption)}
                    </select>
                </div>
            </div>

        )

    }

});

module.exports = ProgramBlock;

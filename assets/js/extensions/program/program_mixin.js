var PROGRAM_DATA = require('./program_data.json');

var parseTerm = function(term, index) {
    var beginDate = term["TermBeginDate"],
        endDate = term["TermEndDate"];
        //termId = term["TermID"];

    term["TermBeginDate"] = new Date(beginDate).toLocaleDateString();
    term["TermEndDate"] = new Date(endDate).toLocaleDateString();

    //var t = {
        //"StartDate": startDate,
        //"GradDate": gradDate,
        //"TermID": termId,
        //index: index
    //};

    //return t;
    return term;
};

var ProgramMixin = {
    _fetchProgramsAndSetState: function() {
        var programData = PROGRAM_DATA;

        this.context.tree.update({
            sources: {
                program: {
                    $set: programData[0]
                }
            },
            extensions: {
                programs: {
                    $set: programData
                },

                programIndex: {
                    $set: 0
                }
            }
        });
    },

    _fetchTermsAndSetState: function(programIndex) {
        var programs = this.state.extensions.programs,
            program = programs[programIndex],
            programDescription = program["ProgramName"];

        //TODO: cache terms and go straight to callback
        $.get('/terms', {
                campus: this.props.query.campus || "Austin",
                program_description: programDescription
            },
            function(terms) {
                var terms = _.map(terms, function(term, i) {
                    return parseTerm(term, i);
                });

                //TODO: Change "Program" to "ProgramName"
                this.context.tree.update({
                    sources: {
                        programTerm: {
                            $set: terms[0]
                        }
                    },
                    extensions: {
                        programTerms: {
                            $set: terms
                        },
                        programTermIndex: {
                            $set: 0
                        }
                    }
                });
            }.bind(this)
        );

    },

    componentDidMount: function() {
        this._fetchProgramsAndSetState();
    },
    
    componentDidUpdate: function(prevProps, prevState) {
        var programIndex = this.state.extensions.programIndex,
            programTermIndex = this.state.extensions.programTermIndex;

        if (programIndex != prevState.extensions.programIndex) {
            var program = this.state.extensions.programs[programIndex]
            this.cursors.sources.set("program", program);
            this._fetchTermsAndSetState(programIndex);
        }

        if (programTermIndex != prevState.extensions.programTermIndex) {
            var programTerm = this.state.extensions.programTerms[programTermIndex]
            this.cursors.sources.set("programTerm", programTerm);
        }
    }
}

module.exports = ProgramMixin;

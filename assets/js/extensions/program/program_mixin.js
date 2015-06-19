var PROGRAM_DATA = require('./program_data.json');

var parseTerm = function(term, index) {
    var beginDate = term["TermBeginDate"],
        endDate = term["TermEndDate"];

    term["TermBeginDate"] = new Date(beginDate).toLocaleDateString();
    term["TermEndDate"] = new Date(endDate).toLocaleDateString();

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

    getProgramData: function(state) {
        var programIndex = state.extensions.programIndex || 0,
            programs = state.extensions.programs,
            program = programs && programs[programIndex],
            campus = state.sources.campus,
            campusName = campus && campus["SCI Name"],
            campusData = program && program.campusData;

        if (campusName && campusData) {
            campusData = campusData[campusName];
            program = _.merge(program, campusData);
        };

        return program;

    },

    componentDidMount: function() {
        this._fetchProgramsAndSetState();
    },
    
    componentDidUpdate: function(prevProps, prevState) {
        var programIndex = this.state.extensions.programIndex,
            programTermIndex = this.state.extensions.programTermIndex,
            programData = this.getProgramData(this.state);

        if (programIndex != prevState.extensions.programIndex) {
            this._fetchTermsAndSetState(programIndex);
            this.cursors.sources.set("program", programData);
        };

        if (this.state.sources.campus != prevState.sources.campus) {
            this.cursors.sources.set("program", programData);
        };

        if (this.state.extensions.programs && !prevState.extensions.programs) {
            this.cursors.sources.set("program", programData);
        };


        if (programTermIndex != prevState.extensions.programTermIndex) {
            var programTerm = this.state.extensions.programTerms[programTermIndex]
            this.cursors.sources.set("programTerm", programTerm);
        };
    }
};

module.exports = ProgramMixin;

var PROGRAM_DATA = require('./program_data.json');

var ProgramMixin = {
    _fetchProgramsAndSetState: function() {
        var programData = PROGRAM_DATA;

        this.context.tree.update({
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
        var programIndex = programIndex || this.state.extensions.programIndex,
            programs = this.state.extensions.programs,
            program = programs[programIndex],
            programDescription = program["Name"];

        if (program.terms) return false;

        console.log("heres the program", program);

        $.get('/terms', {
                campus: this.props.query.campus,
                program_description: programDescription
            },
            function(data) {
                console.log("heres the term data", data)
                program.terms = data;
                programs[programIndex] = program;
                this.context.tree.update({
                    extensions: {
                        programs: {
                            $set: programs
                        },
                        programTermIndex: {
                            $set: 0
                        }
                    }
                });
            }.bind(this)
        );

    },

    currentProgram: function() {
        var programs = this.state.extensions.programs,
            index = this.state.extensions.programIndex;

        if (programs && index) {
            return programs[index];
        };
    },

    currrentProgramTerm: function() {
        var program = this.currentProgram(),
            terms = program && program.terms,
            index = this.state.extensions.programTermIndex;

        if (terms && index) {
            return terms[index];
        };
    },

    componentDidMount: function() {
        this._fetchProgramsAndSetState();
    },
    
    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.extensions.programIndex != prevState.extensions.programIndex) {
            this._fetchTermsAndSetState();
        }
    }
}

module.exports = ProgramMixin;

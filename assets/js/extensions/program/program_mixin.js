var PROGRAM_DATA = require('./program_data.json');
var ProgramsController = require('./../../controllers/programs_controller.js');

var setProgramsController = function() {
    var campus = this.state.sources.campus,
        campusName = campus && campus["SCI Name"],
        loaderFn = this.setLoading;

    this.programsController= new ProgramsController(campusName, loaderFn);
    return this.programsController;
};

var parseTerm = function(term, index) {
    var beginDate = term["TermBeginDate"],
        endDate = term["TermEndDate"];

    term["TermBeginDate"] = new Date(beginDate).toLocaleDateString();
    term["TermEndDate"] = new Date(endDate).toLocaleDateString();

    return term;
};

var ProgramMixin = {
    _fetchProgramsAndSetState: function() {
        var controller = setProgramsController.call(this),
            opts = {},
            programIndex = this.state.extensions.programIndex || 0;

        //opts.refresh = this.props.query.refreshPrograms;

        controller.getPrograms(opts, function(err, programs) {
            if (err) {
                return this.setState({
                    docError: err
                });
            };

            this.context.tree.update({
                sources: {
                    program: {
                        $set: programs[programIndex]
                    }
                },
                extensions: {
                    programs: {
                        $set: programs
                    },

                    programIndex: {
                        $set: programIndex
                    }
                }
            });
        }.bind(this));
    },

    _fetchTermsAndSetState: function(programIndex) {
        var programs = this.state.extensions.programs,
            program = programs[programIndex],
            programDescription = program["ProgramDescription"];

        if (this.state.extensions.programTerms) return false;

        $.get('/terms', {
            campus: this.state.sources.campus["SCI Name"], 
            program_description: programDescription
        },
        function(terms) {
            var terms = _.map(terms, function(term, i) {
                return parseTerm(term, i);
            });

            var terms = _.sortBy(terms, function(t) {
                return new Date(t["TermBeginDate"])
            });

            this.context.tree.update({
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

    modifyProgram: function(program) {
        var tuition = program["Tuition"] = program["Tuition"]|| 0,
            regFee = program["RegFee"] = program["RegFee"] || 0,
            isMorning = program["Session"] === "M";

        program["Total"] = Number(regFee) + Number(tuition);

        program["Morning"] = isMorning; 
        program["Evening"] = !isMorning;

        return program;
    },

    getProgramData: function(state) {
        var programIndex = state.extensions.programIndex || 0,
            programs = state.extensions.programs,
            program = programs && programs[programIndex],
            program = program && this.modifyProgram(program);
            programData = program && _.find(PROGRAM_DATA, function(p) { return p["ProgramDescription"] === program["ProgramDescription"] }),
            campus = state.sources.campus,
            campusName = campus && campus["SCI Name"],
            campusData = programData && programData.campusData;

        if (campusName && campusData) {
            campusData = campusData[campusName];
            program = _.merge(program, campusData);
        };

        return program;
    },

    calculateGradDate: function(programTermIndex, programData) {
        if (programTermIndex != 0 && !programTermIndex || !programData) return false;

        var numTerms = programData["Terms"],
            gradTermIndex = Number(programTermIndex) + Number(numTerms),
            gradTerm = this.state.extensions.programTerms[gradTermIndex];

        if (!gradTermIndex) return false;

        var gradDate = gradTerm ? gradTerm["TermEndDate"] : "Date Not Found in Diamond";

        return {
            "EstimatedGradDate": gradDate
        };
    },

    componentDidMount: function() {
    },

    componentDidUpdate: function(prevProps, prevState) {
        var programIndex = this.state.extensions.programIndex,
            programTermIndex = this.state.extensions.programTermIndex,
            programData = this.getProgramData(this.state),
            gradDate = this.calculateGradDate(programTermIndex, programData);

        if (programIndex != prevState.extensions.programIndex) {
            if (!this.state.sources.programTerms) {
                this._fetchTermsAndSetState(programIndex);
            };

            this.cursors.sources.set("program", programData);
            console.log("program", this.state.sources.program)

            if (gradDate) {
                this.cursors.sources.set("gradDate", gradDate);
            }
        };

        if (this.state.sources.campus != prevState.sources.campus) {
            this._fetchProgramsAndSetState();
            //this.cursors.sources.set("program", programData);
        };

        if (this.state.sources.program != prevState.sources.program) {
            this.cursors.sources.set("program", programData);
        }

        //if (this.state.extensions.programs != !prevState.extensions.programs) {
            //console.log("neew programss", this.state.extensions.programs)
            //this.cursors.sources.set("program", programData);
            //console.log("program", this.state.sources.program)
        //};

        if (programTermIndex != prevState.extensions.programTermIndex) {
            var programTerm = this.state.extensions.programTerms[programTermIndex];

            this.cursors.sources.set("programTerm", programTerm);

            if (gradDate) {
                this.cursors.sources.set("gradDate", gradDate);
            }
        };
    }
};

module.exports = ProgramMixin;

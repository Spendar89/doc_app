var PROGRAM_DATA = require('./program_data.json');
var ProgramsController = require('./../../controllers/programs_controller.js');

var setProgramsController = function() {
    var campus = this.state.sources.campus,
        campusName = campus && campus["SCI Name"],
        loaderFn = this.setLoading;

    this.programsController= new ProgramsController(campusName, loaderFn);
    return this.programsController;
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
            programData = program && _.find(
                PROGRAM_DATA, 
                function(p) { 
                    return p["ProgramDescription"] === program["ProgramDescription"] 
                }
            ),
            campus = state.sources.campus,
            campusName = campus && campus["SCI Name"],
            campusData = programData && programData.campusData;

        if (campusName && campusData) {
            campusData = campusData[campusName];
            program = _.merge(program, campusData);
        };

        return program;
    },

    componentDidUpdate: function(prevProps, prevState) {
        var programIndex = this.state.extensions.programIndex,
            programData = this.getProgramData(this.state);

        if (programIndex != prevState.extensions.programIndex) {
            //TODO: Separate progrma from programData
            this.cursors.sources.set("program", programData);
        };

        if (this.state.sources.program != prevState.sources.program) {
            this.cursors.sources.set("program", programData);
        }

        if (this.state.sources.campus != prevState.sources.campus) {
            this._fetchProgramsAndSetState();
        };

    }
};

module.exports = ProgramMixin;

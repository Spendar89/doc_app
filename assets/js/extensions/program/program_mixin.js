var PROGRAM_DATA = require('./program_data.json');
var ProgramsController = require('./../../controllers/programs_controller.js');

var DEFAULT_PROGRAM_DATA = {
    "ReportYear": "2013-2014",
    "WeeksRequired": 0,
    "HoursRequired": 0,
    "Units": 0,
    "MonthsRequired": 0,
    "RegFee": 0,
    "Tuition": 0,
    "Textbook": 0,
    "OtherFees": 0,
    "Total": 0,
    "campusData": {
        "Austin": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        },
        "San Antonio South": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        },
        "Harlingen": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        },
        "Pharr": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        },
        "Corpus Christi": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        },
        "Brownsville": {
            "NumberEnrolled": 0,
            "NumberGrads": 0,
            "CompletionRate": 0,
            "NumberGradsEmployed": 0,
            "EmploymentRate": 0,
            "NumberGradsPlaced": 0,
            "PlacementRate": 0 
        }
    }
}

var setProgramsController = function() {
    var campus = this.state.sources.campus,
        campusName = campus && campus["CampusName"],
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
            ) || program && DEFAULT_PROGRAM_DATA,
            campus = state.sources.campus,
            campusName = campus && campus["CampusName"],
            campusData = programData && programData.campusData;

        if (campusName && campusData) {
            var months = program["MonthsRequired"];
            program["MonthsRequired"] = Math.ceil(months)

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

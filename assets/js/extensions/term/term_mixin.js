var TermsController = require('./../../controllers/terms_controller.js');

var setController = function() {
    var campus = this.state.sources.campus,
        campusName = campus && campus["SCI Name"],
        loaderFn = this.setLoading;

    this.termsController= new TermsController(campusName, loaderFn);
    return this.termsController;
};

var parseTerm = function(term, index) {
    var beginDate = term["TermBeginDate"],
        endDate = term["TermEndDate"];
        //program = this.state.sources.program;

    //if (program && program["ProgramDescription"].match("Cosmo")) {
         
    //}

    term["TermBeginDate"] = new Date(beginDate).toLocaleDateString();
    term["TermEndDate"] = new Date(endDate).toLocaleDateString();

    return term;
};

var TermMixin = {
    _fetchTermsAndSetState: function(programIndex) {
        var program = this.state.sources.program,
            programNo = program["ProgramNo"],
            controller = setController.call(this);

        //if (this.state.extensions.programTerms) return false;
        //
        controller.getTerms(programNo, function(err, terms) {
            if (err) {
                return this.setState({
                    docError: err
                });
            };

            var terms = _.map(terms, function(term, i) {
                return parseTerm.call(this, term, i);
            });

            var terms = _.sortBy(terms, function(t) {
                // TODO: dont need new Date
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

        }.bind(this));
    },

    calculateGradDate: function(programTermIndex) {
        var programData = this.state.sources.program,
            hasNoIndex = programTermIndex != 0 && !programTermIndex;

        if ( hasNoIndex || !programData) return false;

        //var numTerms = programData["Terms"],
        var numWeeks = programData["WeeksRequired"],
            termLength = 6,
            numTerms = Math.floor(numWeeks/termLength),
            gradTermIndex = Number(programTermIndex) + Number(numTerms),
            gradTerm = this.state.extensions.programTerms[gradTermIndex];

        console.log("Grad Term Index", gradTerm)

        if (!gradTermIndex) return false;

        var gradDate = gradTerm ? gradTerm["TermEndDate"] : "Date Not Found in Diamond";
        console.log("Grad Term Index", gradDate)

        return {
            "EstimatedGradDate": gradDate
        };
    },

    componentDidMount: function() {
    },

    componentDidUpdate: function(prevProps, prevState) {
        var programIndex = this.state.extensions.programIndex,
            programTermIndex = this.state.extensions.programTermIndex,
            gradDate = this.calculateGradDate(programTermIndex);

        if (this.state.sources.program != prevState.sources.program) {
            this._fetchTermsAndSetState(programIndex);
        }

        if (programTermIndex != prevState.extensions.programTermIndex) {
            var programTerm = this.state.extensions.programTerms[programTermIndex];

            this.cursors.sources.set("programTerm", programTerm);

            if (gradDate) {
                this.cursors.sources.set("gradDate", gradDate);
            }
        };
    }
};

module.exports = TermMixin;

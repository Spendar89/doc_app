var TermsController = require('./../../controllers/terms_controller.js');

var setController = function() {
    var campus = this.state.sources.campus,
        campusName = campus && campus["CampusName"],
        loaderFn = this.setLoading;

    this.termsController = new TermsController(campusName, loaderFn);
    return this.termsController;
};

var TermMixin = {
    _fetchTermsAndSetState: function(programIndex) {
        var program = this.state.sources.program,
            programNo = program["ProgramNo"],
            controller = setController.call(this),
            terms = this.state.extensions.programTerms;


        var handleTerms = function(err, terms) {
            if (err) {
                return this.setState({
                    docError: err
                });
            };

            var parseTerm = function(term) {
                var beginDate = Moment(term["TermBeginDate"]),
                    endDate = Moment(term["TermEndDate"]);

                var termLength = endDate
                                .add(1, "days")
                                .diff(beginDate, 'weeks');

                term["TermLength"] = termLength;
                term["TermBeginDate"] = beginDate.format("MM/DD/YY");
                term["TermEndDate"] = endDate.format("MM/DD/YY");

                return term;
            };

            var filterTerm = function(term) {
                var l = term["TermLength"],
                    desc = program["ProgramDescription"];

                if (desc.match("HVAC")) {
                    if (desc.match("Evening")) {
                        return l === 8;
                    } else {
                        return l === 6;
                    };

                    return false;
                };

                return l === 3 || l === 2;
            };

            var sortTerm = function(t) {
                return new Date(t["TermBeginDate"]);
            };

            terms = _(terms)
                    .map(parseTerm)
                    .filter(filterTerm)
                    .sortBy(sortTerm)
                    .value();


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

        };

        controller.getTerms(handleTerms.bind(this));
    },

    calculateGradDate: function(termIndex) {
        var programData = this.state.sources.program,
            hasNoIndex = termIndex != 0 && !termIndex,
            terms = this.state.extensions.programTerms,
            term = terms && terms[termIndex],
            termLength = term && term["TermLength"]

        if ( hasNoIndex || !programData || !termLength) return false;

        var numWeeks = programData["WeeksRequired"],
            numTerms = Math.floor(numWeeks/termLength),
            gradTermIndex = Number(termIndex) + Number(numTerms),
            gradTerm = terms[gradTermIndex];

        if (!gradTermIndex) return false;

        var gradDate = gradTerm ? gradTerm["TermEndDate"] : "Date Not Found";

        return {
            "EstimatedGradDate": gradDate
        };
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

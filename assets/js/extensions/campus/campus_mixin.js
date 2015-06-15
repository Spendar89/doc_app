var CAMPUS_DATA = require('./campus_data.json');

module.exports = {
    _fetchCampusesAndSetState: function() {
        this.context.tree.update({
            sources: {
                campus: {
                    $set: CAMPUS_DATA[0]
                }
            },

            extensions: {
                campuses: {
                    $set: CAMPUS_DATA
                },

                campusIndex: {
                    $set: 0
                }
            }
        });
    },

    componentDidMount: function() {
        this._fetchCampusesAndSetState();
    },

    componentDidUpdate: function(prevProps, prevState) {
        var campusIndex = this.state.extensions.campusIndex;

        if (!this.props.query.campus && campusIndex != prevState.extensions.campusIndex) {
            console.log("new campus Index!", campusIndex)
            var campus = this.state.extensions.campuses[campusIndex];
            this.cursors.sources.set("campus", campus);
        };

        if (this.props.query.campus && this.state.sources.campus && this.props.query.campus != this.state.sources.campus["SCI Name"]) {
            _.each(this.state.extensions.campuses, function(campus, i) {
                if (campus["SCI Name"] === this.props.query.campus) {
                    console.log("changing campus index from query 2")
                    var campus = CAMPUS_DATA[i];
                    this.cursors.extensions.set("campusIndex", i);
                    return this.cursors.sources.set("campus", campus);
                };
            }.bind(this));
        };

        //if (this.props.query.campus != prevProps.query.campus) {
            //_.each(this.state.extensions.campuses, function(campus, i) {
                //if (campus["SCI Name"] === this.props.query.campus) {
                    //console.log("changing campus index from query")
                    //return this.cursors.extensions.set("campusIndex", i);
                //}
            //}.bind(this))
        //};


    }
};

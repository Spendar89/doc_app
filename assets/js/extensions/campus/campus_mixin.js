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
        var campusIndex = this.state.extensions.campusIndex,
            queryCampus = this.props.query.campus,
            campuses = this.state.extensions.campuses,
            campus = this.state.sources.campus;

        if (campusIndex != prevState.extensions.campusIndex) {
            console.log("new campus Index!", campusIndex)
            var campus = this.state.extensions.campuses[campusIndex];
            this.cursors.sources.set("campus", campus);
        };

        if (queryCampus && campus && queryCampus != campus["SCI Name"]) {
            _.each(campuses, function(c, i) {
                if (c["SCI Name"] === queryCampus) {
                    return this.cursors.extensions.set("campusIndex", i);
                };
            }.bind(this));
        };

    }
};

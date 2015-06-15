var CampusBlock = React.createClass({

    renderCampusOption: function(campus, i) {
        return <option key={i} value={i}>{campus["SCI Name"]}</option>
    },

    render: function() {
        return (
            <div>
                <p><i>Select a campus from the provided options:</i></p>

                <div className="form-group">
                    <label className="control-label">Campus</label>
                    <select className="form-control" 
                            disabled={!this.props.campuses}
                            onChange={this.props.onCampusIndexChange} 
                            selected={this.props.campusIndex}>
                        {_.map(this.props.campuses, this.renderCampusOption)}
                    </select>
                </div>
            </div>

        )

    }

});

module.exports = CampusBlock;

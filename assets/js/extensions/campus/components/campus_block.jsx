var CampusBlock = React.createClass({

    renderCampusOption: function(campus, i) {
        return <option key={i} value={i}>{campus["SCI Name"]}</option>
    },

    render: function() {
        return (
            <div>
                <i>
                    <p>Select a campus from the provided options (Disabled when lead has already been selected):</p>
                </i>

                <div className="form-group">
                    <label className="control-label">Campus</label>
                    <select className="form-control" 
                            disabled={!this.props.campuses || this.props.query.campus || this.props.query.vId}
                            onChange={this.props.onCampusIndexChange} 
                            value={this.props.campusIndex} >
                        {_.map(this.props.campuses, this.renderCampusOption)}
                    </select>
                </div>
            </div>

        )

    }

});

module.exports = CampusBlock;

var DocBlock = require('./doc/doc_block.jsx')

var AppTemplate = React.createClass({
    render: function() {
        return (
            <div className="app-template-div container">
                <DocBlock />
            </div>
        )

    }

});

module.exports = AppTemplate;


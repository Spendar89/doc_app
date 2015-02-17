var DocForm = require('./doc_form.jsx');

var DocBlock = React.createClass({

    render: function() {
        return (
            <div className="doc-block">
                <DocForm /> 
            </div>
        )

    }

});

module.exports = DocBlock;

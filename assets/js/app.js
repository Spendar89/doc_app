React = require('react');
_ = require('lodash');
async = require('async');

var Baobab = require('baobab'),
    RootMixin = require('baobab-react/mixins').root;

var TemplateLayout = require('./components/template/layout.jsx');
var EA_PACKAGE_DATA = require('./lib/packages/ea_package/package_data.json');

var tree = new Baobab({
    package: EA_PACKAGE_DATA,
    allCustomFields: {},
    recipient: {},
    extensions: {}
})

var App = React.createClass({
    mixins: [RootMixin],



    render: function () {
        return (
            <div>
                <div className="app-template-div container-fluid">
                    <TemplateLayout params={{leadId: "1409446"}} query={{campus: "Austin"}} />
                </div>
            </div>
        );
    }
});

React.render(<App tree={tree} />, document.body);

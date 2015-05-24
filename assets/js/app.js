require('./lib/globals.js');

var Baobab = require('baobab'),
    RootMixin = require('baobab-react/mixins').root,
    Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var TemplateLayout = require('./components/template/layout.jsx');
var EA_PACKAGE_DATA = require('./lib/packages/ea_package/package_data.json');

var tree = new Baobab({
    package: EA_PACKAGE_DATA,
    allCustomFields: {},
    extensions: {},
    sources: {}
})

var Layout = React.createClass({
    mixins: [RootMixin],

    render: function () {
        return (
            <div>
                <div className="app-template-div container-fluid">
                    <TemplateLayout params={{leadId: "1409446"}} query={this.props.query} />
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Layout tree={tree} query={this.props.query}/>
                <RouteHandler/>
            </div>
        )
    }
});


var routes = (
    <Route handler={App} path="/"/>
);

Router.run(routes, function (Handler, state) {
    React.render(<Handler query={state.query}/>, document.body);

});

// Or, if you'd like to use the HTML5 history API for cleaner URLs:
//
 //Router.run(routes, Router.HistoryLocation, function (Handler) {
   //React.render(<Handler/>, document.body);
 //});

//React.render(<App tree={tree} />, document.body);

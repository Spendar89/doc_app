React = require('react');
_ = require('lodash');
async = require('async');

var Baobab = require('baobab'),
    RootMixin = require('baobab-react/mixins').root;

//var LeadIndexLayout = require('./extensions/lead/components/index/layout.jsx');
var TemplateLayout = require('./components/template/layout.jsx');
var EA_PACKAGE_DATA = require('./lib/packages/ea_package/package_data.json');

//var Router = require('react-router'); // or var Router = ReactRouter; in browsers
//var DefaultRoute = Router.DefaultRoute;
//var Link = Router.Link;
//var Route = Router.Route;
//var RouteHandler = Router.RouteHandler;

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
                <header>
                </header>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <img alt="Brand" src="/images/sci-logo.png"/>
                            </a>
                        </div>
                        <h4 className="pull-right">SCI Document Manager</h4>
                    </div>
                </nav>
                <div className="app-template-div container-fluid">
                    <TemplateLayout params={{leadId: "1409446"}} query={{campus: "Austin"}} />
                    { /* <RouteHandler {...this.props}/> */ } 
                </div>
            </div>
        );
    }
});

/*
    var routes = (
        <Route name="app" path="/" handler={App}>
            <DefaultRoute handler={LeadIndexLayout} />
            <Route name="leads" handler={LeadIndexLayout}/>
            <Route name="lead" path="/leads/:leadId" handler={TemplateLayout}/>
        </Route>
    );
*/

React.render(<App tree={tree} />, document.body);

//Router.run(routes, function (Handler, state) {
    //React.render(<Handler params={state.params} query={state.query}/>, document.body);
//});

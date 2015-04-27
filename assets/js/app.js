React = require('react')
_ = require('lodash')
async = require('async')

var LeadIndexTemplate = require('./components/lead//index/template.jsx');
var LeadShowTemplate = require('./components/lead/show/template.jsx');
var DocShowTemplate = require('./components/doc/show/template.jsx');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
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
                    <RouteHandler {...this.props}/>
                </div>
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={LeadIndexTemplate} />
        <Route name="leads" handler={LeadIndexTemplate}/>
        <Route name="lead" path="/leads/:leadId" handler={LeadShowTemplate}/>
        <Route name="doc" path="/docs/:signatureRequestId" handler={DocShowTemplate}/>
    </Route>
);

Router.run(routes, function (Handler, state) {
    React.render(<Handler params={state.params} query={state.query}/>, document.body);
});

React = require('react')
_ = require('lodash')

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
                    <ul>
                    </ul>
                </header>
                <RouteHandler {...this.props}/>
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="leads" handler={LeadIndexTemplate}/>
        <Route name="lead" path="/leads/:leadId" handler={LeadShowTemplate}/>
        <Route name="doc" path="/docs/:signatureRequestId" handler={DocShowTemplate}/>
    </Route>
);

Router.run(routes, function (Handler, state) {
    React.render(<Handler params={state.params}/>, document.body);
});

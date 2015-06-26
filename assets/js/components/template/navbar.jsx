var Navbar = React.createClass({

    render: function() {
        var savedDocs, newDoc;

        var hasPage = _.any(window.location.href.split("&")[1])

        if (hasPage) {
            savedDocs = window.location.href.split("&page")[0]  + "&page=savedDocs";
            newDoc = window.location.href.split("&page")[0]  + "&page=newDoc";
        } else {
            savedDocs = window.location.href.split("?page")[0]  + "?page=savedDocs";
            newDoc = window.location.href.split("?page")[0]  + "?page=newDoc";

        }

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">
                            <img alt="Brand" src="/images/sci-logo.png"/>
                        </a>
                        <h5 className="pull-left">SCI Document Manager</h5>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right col-sm-6">
                            <li className="pull-right"><a href={savedDocs}>Saved Docs</a></li>
                            <li className="pull-right"><a href={newDoc}>New Doc</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

        )
    }
})

module.exports = Navbar;

var Navbar = React.createClass({

    render: function() {
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
                        </ul>
                    </div>
                </div>
            </nav>

        )
    }
})

module.exports = Navbar;

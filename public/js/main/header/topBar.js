var Login = React.createClass({
  render: function(){
    return(
      <div className="content">
        <a href="/auth/github" className="login">Login</a>
      </div>
    );
  }
});

var Header = React.createClass({
  render: function(){
    return(
      <div className="content">
        <h1 className="appTitle">Gisthub</h1>
            <Login />
      </div>
    );
  }
});

ReactDOM.render(
  <Header/>,
    document.getElementById("content")
  );

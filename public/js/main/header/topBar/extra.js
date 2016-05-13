var Login = React.createClass({
  render: function(){
    return(
      <div className="content">
        <a href="/auth/github" className="login">Login</a>
      </div>
    );
  }
});

ReactDOM.render(
  <Login/>,
    document.getElementById("title")
  );

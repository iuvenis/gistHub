var Header = React.createClass({
  render: function(){
    return(
      <div className="content">
        <h1 className="appTitle">Gisthub</h1>
        <div id='title'>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Header/>,
    document.getElementById("content")
  );

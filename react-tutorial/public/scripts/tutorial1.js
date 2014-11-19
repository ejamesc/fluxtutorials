var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentBox = React.createClass({
  // Executes exactly once in the lifecycle of the component
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        // This re-renders the component.
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // This is a handler which we will bind to the onCommentSubmit event on the
  // comment form
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // Executes automatically when a componenet is rendered
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} pollInterval={2000} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
      );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); // prevent browser's default behaviour of submitting form
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    // We call the onCommentSubmit callback when user submits the form
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" /> { /* Note the ref */ }
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
        );
    });
    return (
      <div className="commentList">
        {CommentForm}
        {commentNodes}
      </div>
      );
  }
});

// Use Showdown to transform markdown
var converter = new Showdown.converter();

// Props are data passed from parent to children components.
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {/* Named attributes are passed as keys on this.props */}
          {this.props.author}
        </h2>
          {/* Any nested elements */}
          {/* converter.makeHtml(this.props.children.toString()) */ } 
          <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
      );
  }
});

React.render(
    <CommentBox url="comments.json" />,
    document.getElementById('content')
    );

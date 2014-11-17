var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList/>
        <CommentForm />
      </div>
      );
  }
});

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jordan Walker">This is *another* comment</Comment>
      </div>
      );
  }
});

// Props are data passed from parent to children components.
var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {/* Named attributes are passed as keys on this.props */}
          {this.props.author}
        </h2>
          {/* Any nested elements */}
          {this.props.children} 
      </div>
      );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return(
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
      );
  }
});

React.render(
    <CommentBox />,
    document.getElementById('content'));

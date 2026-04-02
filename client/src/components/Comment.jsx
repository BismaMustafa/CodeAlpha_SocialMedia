const Comment = ({ comment }) => {
  return (
    <p className="text-sm">
      <strong>{comment.user?.name}:</strong> {comment.text}
    </p>
  );
};

export default Comment;
import React, { useEffect, useState } from "react";
import CommentsList, { AddCommentsForm } from "../common/comments";
import { useParams } from "react-router-dom";
import api from "../../api";
import { orderBy } from "lodash";

function commentsCard() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  useEffect(() => {
    api.comments.fetchCommentsForUser(userId).then((data) => setComments(data));
  }, []);
  const sortedComments = orderBy(comments, ["created_at"], ["desc"]);

  const handleRemoveComment = (id) => {
    api.comments.remove(id).then((id) => {
      setComments(comments.filter((person) => person._id !== id));
    });
  };

  const handleAddComment = (data) => {
    api.comments.add({ ...data, pageId: userId }).then((data) => setComments([...comments, data]));
  };
  return (
    <>
      <div className="card mb-2">
        {" "}
        <div className="card-body ">
          <AddCommentsForm onSubmit={handleAddComment} />
        </div>
      </div>
      {sortedComments.length > 0 && (
        <div className="card mb-3">
          <div className="card-body ">
            <h2>Комментарии</h2>
            <hr />
            <CommentsList
              comments={sortedComments}
              onRemove={handleRemoveComment}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default commentsCard;

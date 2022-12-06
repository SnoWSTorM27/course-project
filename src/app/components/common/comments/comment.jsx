import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Loader from "../loader";
import { viewDate } from "../../../utils/viewDate";

function Comment({ content, created_at, _id, userId, onRemove }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api.users.getById(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);
  return (
    <div className="bg-light card-body  mb-3">
      <div className="row">
        {loading ? (
          <Loader/>
        ) : (
          <div className="col">
            <div className="d-flex flex-start ">
              <img
                src={`https://avatars.dicebear.com/api/avataaars/${(
                  Math.random() + 1
                )
                  .toString(36)
                  .substring(7)}.svg`}
                className="rounded-circle shadow-1-strong me-3"
                alt="avatar"
                width="65"
                height="65"
              />
              <div className="flex-grow-1 flex-shrink-1">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1 ">
                      {user && user.name}{" "}
                      <span className="small">
                        - {viewDate(created_at)}
                      </span>
                    </p>
                    <button
                      className="btn btn-sm text-primary d-flex align-items-center"
                      onClick={() => onRemove(_id)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <p className="small mb-0">
                    {content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
Comment.propTypes = {
  content: PropTypes.string,
  created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  _id: PropTypes.string,
  userId: PropTypes.string,
  onRemove: PropTypes.func
};

export default Comment;

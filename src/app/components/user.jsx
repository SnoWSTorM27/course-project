import React from "react";
import BookMark from "./bookmark";
import Qualities from "./qualities";
import PropTypes from "prop-types";

export default function User({ user, onToggleBookMark, onDelete }) {
  return (
    <>
      <tr>
        <td>{user.name}</td>
        <td>
          {user.qualities.map((quality) => (
            <Qualities key={quality._id} {...quality} />
          ))}
        </td>
        <td>{user.profession.name}</td>
        <td>{user.completedMeetings}</td>
        <td>{user.rate}/5</td>
        <td>
          <button onClick={() => onToggleBookMark(user._id)}>
            <BookMark status={user.bookmark} />
          </button>
        </td>
        <td>
          <button className="btn btn-danger" onClick={() => onDelete(user._id)}>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
User.propTypes = {
  user: PropTypes.object,
  onToggleBookMark: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

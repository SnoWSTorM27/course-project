import React from 'react';
import BookMark from './bookmark';
import Qualities from './qualities';

export default function User(props) {
  const {user} = props

  return (
    <>
      <tr>
        <td>{user.name}</td>
        <td>
          {user.qualities.map(quality=>(
            <Qualities
              key={quality._id}
              {...quality}
              // color={quality.color}
              // name={quality.name}
              // _id={quality._id}
            />
          ))}
        </td>
        <td>{user.profession.name}</td>
        <td>{user.completedMeetings}</td>
        <td>{user.rate}/5</td>
        <td>
          <button
            onClick={()=>props.onToggleBookMark(user._id)}
          >
            <BookMark 
              status={user.bookmark}
            />
          </button>
          
        </td>
        <td>
          <button
            className='btn btn-danger'
            onClick={()=>props.onDelete(user._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}

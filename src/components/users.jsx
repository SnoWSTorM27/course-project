import React, { useState } from 'react';
import api from "../api"

export default function Users() {
  const [users, setUsers] = useState(api.users.fetchAll());

  const getBadgeClasses = (color) => {
    let classes ="badge m-2 bg-";
    classes+=color;
    return classes;
  };

  const handleDelete =(userId)=> {
    setUsers(prevState=>prevState.filter(user=>user._id!==userId))
  };

  const renderPhrase =()=> {
    let phrase = `${users.length} человек тусанёт `;
    if ([2,3,4].includes(users.length)) {
      phrase = `${users.length} человека тусанут `;
    }
    return (users.length === 0) ? (
      <span className="badge bg-danger m-2">Никто с тобой не тусанёт</span>
    ) : (<span className="badge bg-primary m-2">{phrase}с тобой сегодня</span> );
  };

  return (
    <>
    {renderPhrase()}
  {(users.length !==0) ? 
    (<table className="table">
      <thead>
        <tr>
          <th scope="col">Имя</th>
          <th scope="col">Качества</th>
          <th scope="col">Профессия</th>
          <th scope="col">Встретился, раз</th>
          <th scope="col">Оценка</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.qualities.map(quality=>(
                  <span
                    key={quality._id}
                    className={getBadgeClasses(quality.color)}
                  >
                    {quality.name}
                  </span>
                ))}
            </td>
            <td>{user.profession.name}</td>
            <td>{user.completedMeetings}</td>
            <td>{user.rate}/5</td>
            <td>
              <button
                className='btn btn-danger'
                onClick={()=>handleDelete(user._id)}
              >
                delete
              </button></td>
          </tr>
        ))}
      </tbody>
    </table>) : null}
    </>
  )
}

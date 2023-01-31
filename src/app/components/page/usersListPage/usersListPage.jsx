import React, { useState, useEffect } from "react";
import { paginate } from "../../../utils/paginate";
import Pagination from "../../common/pagination";
import UsersTable from "../../ui/usersTable";
import PropTypes from "prop-types";
import GroupList from "../../common/groupList";
import SearchStatus from "../../ui/searchStatus";
import _ from "lodash";
import Loader from "../../common/loader";
import SearchField from "../../common/form/searchField";
import { useUsers } from "../../../hooks/useUsers";
import { useProfession } from "../../../hooks/useProfession";
import { useAuth } from "../../../hooks/useAuth";

function UsersListPage() {
  const pageSize = 8;
  const { currentUser } = useAuth();
  const { isLoading: professionsLoading, professions } = useProfession();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProf, setSelectedProf] = useState();
  const [sortBy, setSortBy] = useState({ iter: "name", order: "asc" });
  const { users } = useUsers();
  const [searchUsers, setSearchUsers] = useState("");

  const handleToggleBookMark = (id) => {
    const newListUsers = users.map((user) => {
      if (user._id === id) {
        return { ...user, bookmark: !user.bookmark };
      }
      return user;
    });
    // setUsers(newListUsers);
    console.log(newListUsers);
  };

  useEffect(() => {
    setCurrentPage(1);
    if (selectedProf) {
      setSearchUsers("");
    } else if (searchUsers) {
      setSelectedProf();
    }
  }, [selectedProf, searchUsers]);

  const handleProfessionSelect = (item) => {
    if (searchUsers !== "") setSearchUsers("");
    setSelectedProf(item);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSort = (item) => {
    setSortBy(item);
  };
  if (users) {
    function filterUsers(data) {
      let filteredUsers = data;
      if (selectedProf) {
        filteredUsers = data.filter((user) => JSON.stringify(user.profession) === JSON.stringify(selectedProf));
      } else if (searchUsers) {
        filteredUsers = data.filter((user) => JSON.stringify(user.name).toLowerCase().includes(searchUsers.toLowerCase()));
      }
      return filteredUsers.filter((user) => user._id !== currentUser._id);
    };
    const filteredUsers = filterUsers(users);
    const count = filteredUsers.length;
    const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order]);
    const userCrop = paginate(sortedUsers, currentPage, pageSize);
    const clearFilter = () => {
      setSelectedProf();
      setSearchUsers("");
    };

    const handleSearchChange = (e) => {
      setSelectedProf();
      const { value } = e.target;
      setSearchUsers(value);
    };

    return (
      <div className="d-flex">
        {professions && !professionsLoading && (
          <div className="d-flex flex-column flex-shrink p-3">
            <GroupList
              selectedItem={selectedProf}
              items={professions}
              onItemSelect={handleProfessionSelect}
            />
            <button className="btn btn-secondary mt-2" onClick={clearFilter}>
              Очистить
            </button>
          </div>
        )}
        <div className="d-flex flex-column">
          <SearchStatus length={count} />
          <SearchField
            label="Поиск"
            name="search"
            value={searchUsers}
            onChange={handleSearchChange}
          />
          {count > 0 && (
            <UsersTable
              users={userCrop}
              onSort={handleSort}
              selectedSort={sortBy}
              onToggleBookMark={handleToggleBookMark}
            />
          )}
          <div className="d-flex justify-content-center">
            <Pagination
              itemsCount={count}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
  return <Loader />;
}
UsersListPage.propTypes = {
  users: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default UsersListPage;

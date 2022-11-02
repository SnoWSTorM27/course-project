import React, { useState, useEffect } from "react";
import { paginate } from "../../../utils/paginate";
import Pagination from "../../common/pagination";
import UsersTable from "../../ui/usersTable";
import api from "../../../api";
import PropTypes from "prop-types";
import GroupList from "../../common/groupList";
import SearchStatus from "../../ui/searchStatus";
import _ from "lodash";
import Loader from "../../common/loader";
import SearchField from "../../common/form/searchField";

function UsersListPage() {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [professions, setProfessions] = useState();
  const [selectedProf, setSelectedProf] = useState();
  const [sortBy, setSortBy] = useState({ iter: "name", order: "asc" });
  const [users, setUsers] = useState();
  const [searchUsers, setSearchUsers] = useState("");

  useEffect(() => {
    api.users.fetchAll().then((data) => setUsers(data));
  }, []);
  const handleDelete = (userId) => {
    setUsers((users) => users.filter((user) => user._id !== userId));
  };

  const handleToggleBookMark = (id) => {
    const newListUsers = users.map((user) => {
      if (user._id === id) {
        return { ...user, bookmark: !user.bookmark };
      }
      return user;
    });
    setUsers(newListUsers);
  };

  useEffect(() => {
    api.professions.fetchAll().then((data) => setProfessions(data));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    if (selectedProf) {
      setSearchUsers("");
    } else if (searchUsers) {
      setSelectedProf();
    }
  }, [selectedProf, searchUsers]);

  const handleProfessionSelect = (item) => {
    setSelectedProf(item);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleSort = (item) => {
    setSortBy(item);
  };
  if (users) {
    let filteredUsers = users;
    if (selectedProf) {
      filteredUsers = users.filter((user) => JSON.stringify(user.profession) === JSON.stringify(selectedProf));
    } else if (searchUsers) {
      filteredUsers = users.filter((user) => JSON.stringify(user.name).toLowerCase().includes(searchUsers.toLowerCase()));
    }
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
        {professions && (
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
              onDelete={handleDelete}
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

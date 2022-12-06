import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TextAreaField from "../form/textAreaField";
import { validator } from "../../../utils/validator";
import api from "../../../api";
import SelectField from "../form/selectField";
const initialData = { userId: "", content: "" };

function AddCommentsForm({ onSubmit }) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState({});
  useEffect(() => {
    api.users.fetchAll().then((data) => {
      setUsers(data);
    });
  }, []);
  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  const validatorConfig = {
    userId: {
      isRequired: {
        message: "Выберите пользователя"
      }
    },
    content: {
      isRequired: {
        message: "Сообщение не может быть пустым"
      }
    }
  };

  useEffect(() => {
    validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  const clearForm = () => {
    setData(initialData);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    onSubmit(data);
    clearForm();
  };

  const usersArray =
  users &&
  Object.keys(users).map((userId) => ({
    label: users[userId].name,
    value: users[userId]._id
  }));
  return (
    <div>
      <h2>Новый комментарий</h2>
      <form onSubmit={handleSubmit} >
        <SelectField
          label="Выберите пользователя"
          defaultOption="Выбор..."
          options={usersArray}
          value={data.userId}
          onChange={handleChange}
          error={errors.userId}
          name="userId"
        />
        <TextAreaField
          label="Текст комментария"
          name="content"
          value={data.content}
          onChange={handleChange}
          error={errors.content}
        />
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={!isValid}
            className="btn btn-primary"
          >Написать</button>
        </div>
      </form>
    </div>
  );
}
AddCommentsForm.propTypes = {
  onSubmit: PropTypes.func
};

export default AddCommentsForm;

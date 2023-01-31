import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TextField from "../../common/form/textField";
import { validator } from "../../../utils/validator";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultySelectField from "../../common/form/multiSelectField";
import Loader from "../../common/loader";
import { useUsers } from "../../../hooks/useUsers";
import { useQualities } from "../../../hooks/useQualities";
import { useProfession } from "../../../hooks/useProfession";
import { useAuth } from "../../../hooks/useAuth";

function EditUserPage() {
  const { userId } = useParams();
  const { getUserById } = useUsers();
  const user = getUserById(userId);
  const [data, setData] = useState({ name: "", email: "", profession: "", sex: "male", qualities: [] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const { qualities, getQuality } = useQualities();
  const { professions } = useProfession();
  const { updateUserData } = useAuth();

  function getAndTransformQualities(elements) {
    const qualArr = Object.values(elements).map(qualityId => {
      return getQuality(qualityId);
    });
    const transformArr = qualArr.map((optionName) => ({
      label: optionName.name,
      value: optionName._id,
      color: optionName.color
    }));
    return transformArr;
  };

  const professionsList = professions.map((professionName) => ({
    label: professionName.name,
    value: professionName._id
  }));

  const qualitiesList = qualities.map((optionName) => ({
    label: optionName.name,
    value: optionName._id,
    color: optionName.color
  }));
  useEffect(() => {
    setData((prevState) => ({ ...prevState, ...user, qualities: getAndTransformQualities(user.qualities) }));
  }, []);

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  const validatorConfig = {
    name: {
      isRequired: {
        message: "Имя Фамилия обязательны для заполнения"
      }
    },
    email: {
      isRequired: {
        message: "Электронная почта обязательна для заполнения"
      },
      isEmail: {
        message: "Email введён некорректно"
      }
    },
    profession: {
      isRequired: {
        message: "Обязательно выберите вашу профессию"
      }
    }
  };

  useEffect(() => {
    if (data._id) setLoading(false);
  }, [data]);

  useEffect(() => {
    validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  const history = useHistory();
  const goToUserPage = () => {
    history.push(`/users/${userId}`);
    history.go(0);// Экостыль" обновления данных
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    const newData = {
      ...data,
      qualities: data.qualities.map(q => q.value)
    };
    console.log(newData);
    await updateUserData(newData);
    goToUserPage();
  };
  return (
    <div className="container mt-5">
      <button
        className="btn btn-primary"
        onClick={() => history.goBack()}
      >
        <i className="bi bi-caret-left"></i>
        Назад
      </button>
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!loading && Object.keys(professions).length > 0 ? (
            <form onSubmit={handleSubmit} >
              <TextField
                label="Имя Фамилия"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="Электронная почта"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <SelectField
                label="Выберите вашу профессию"
                defaultOption="Выбор..."
                options={professionsList}
                value={data.profession}
                onChange={handleChange}
                error={errors.profession}
                name="profession"
              />
              <RadioField
                options={[{ name: "муж.", value: "male" }, { name: "жен.", value: "female" }]}
                value={data.sex}
                name="sex"
                onChange={handleChange}
                label="Выберите ваш пол"
              />
              <MultySelectField
                options={qualitiesList}
                onChange={handleChange}
                defaultValue={data.qualities}
                name="qualities"
                label="Выберите ваши качества"
              />
              <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
              >Обновить</button>
            </form>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditUserPage;

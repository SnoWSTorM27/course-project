import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TextField from "../common/form/textField";
import { validator } from "../../utils/validator";
import api from "../../api";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultySelectField from "../common/form/multiSelectField";
import Loader from "../common/loader";

function EditUserForm() {
  const { userId } = useParams();
  const [data, setData] = useState({ name: "", email: "", profession: "", sex: "male", qualities: [] });
  const [professions, setProfessions] = useState([]);
  const [errors, setErrors] = useState({});
  const [qualities, setQualities] = useState([]);
  const transformData = (data) => {
    return data.map((el) => ({ label: el.name, value: el._id }));
  };
  useEffect(() => {
    api.users.getById(userId).then(({ profession, qualities, ...data }) =>
      setData((prevState) => ({
        ...prevState,
        ...data,
        profession: profession._id,
        qualities: transformData(qualities)
      }))
    );
    api.professions.fetchAll().then((data) => {
      const professionsList = Object.keys(data).map((professionName) => ({
        label: data[professionName].name,
        value: data[professionName]._id
      }));
      setProfessions(professionsList);
    });
    api.qualities.fetchAll().then((data) => {
      const qualitiesList = Object.keys(data).map((optionName) => ({
        label: data[optionName].name,
        value: data[optionName]._id,
        color: data[optionName].color
      }));
      setQualities(qualitiesList);
    });
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
      },
      isOneSpace: {
        message: "Между Именем и Фамилией должен быть один пробел"
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
    validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  const getProfessionById = (id) => {
    for (const prof of professions) {
      if (prof.value === id) {
        return { _id: prof.value, name: prof.label };
      }
    }
  };
  const getQualities = (elements) => {
    const qualitiesArray = [];
    for (const elem of elements) {
      for (const quality in qualities) {
        if (elem.value === qualities[quality].value) {
          qualitiesArray.push({
            _id: qualities[quality].value,
            name: qualities[quality].label,
            color: qualities[quality].color
          });
        }
      }
    }
    return qualitiesArray;
  };

  const history = useHistory();
  const goToUserPage = () => {
    history.push(`/users/${userId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    const { profession, qualities } = data;
    console.log({
      ...data,
      profession: getProfessionById(profession),
      qualities: getQualities(qualities)
    });
    api.users.update(userId, {
      ...data,
      profession: getProfessionById(profession),
      qualities: getQualities(qualities)
    });
    goToUserPage();
  };

  if (professions) {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3 shadow p-4">
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
                options={professions}
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
                options={qualities}
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
          </div>
        </div>
      </div>
    );
  }
  return <Loader />;
}

export default EditUserForm;

import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import professionService from "../services/profession.service";
import { toast } from "react-toastify";

const ProfessionContex = React.createContext();

export const useProfession = () => {
  return useContext(ProfessionContex);
};

export const ProfessionProvider = ({ children }) => {
  const [professions, setProfessions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getProfessionsList();
  }, []);
  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  async function getProfessionsList() {
    try {
      const { content } = await professionService.get();
      setProfessions(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
      setLoading(false);
    }
  };

  function getProfession(id) {
    return professions.find((p) => p._id === id);
  }
  function errorCatcher(error) {
    const { message } = error.responce.data;
    setError(message);
  };

  return (
    <ProfessionContex.Provider value={{ professions, isLoading, getProfession }}>
      {children}
    </ProfessionContex.Provider>
  );
};

ProfessionProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

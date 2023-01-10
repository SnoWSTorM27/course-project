import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import qualityService from "../services/quality.service";
import { toast } from "react-toastify";

const QualitiesContex = React.createContext();

export const useQualities = () => {
  return useContext(QualitiesContex);
};

export const QualitiesProvider = ({ children }) => {
  const [qualities, setQualities] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getQualitiesList();
  }, []);
  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  async function getQualitiesList() {
    try {
      const { content } = await qualityService.fetchAll();
      setQualities(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
      setLoading(false);
    }
  };

  function getQuality(id) {
    return qualities.find((q) => q._id === id);
  }
  function errorCatcher(error) {
    const { message } = error.responce.data;
    setError(message);
  };

  return (
    <QualitiesContex.Provider value={{ qualities, isLoading, getQuality }}>
      {children}
    </QualitiesContex.Provider>
  );
};

QualitiesProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

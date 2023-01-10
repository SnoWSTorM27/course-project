import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { useQualities } from "../../../hooks/useQualities";
import Loader from "../../common/loader";

function QualitiesList({ qualities }) {
  const { isLoading, getQuality } = useQualities();
  const qualitiesArray = [];
  qualities.forEach(qualityId => {
    const quality = getQuality(qualityId);
    qualitiesArray.push(quality);
  });
  if (!isLoading) {
    return (
      <>
        {qualitiesArray.map((quality) => (
          <Quality key={quality._id} {...quality} />
        ))}
      </>
    );
  } else return <Loader />;
}
QualitiesList.propTypes = {
  qualities: PropTypes.array
};

export default QualitiesList;

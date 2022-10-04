import React from "react";
import PropTypes from "prop-types";

export default function SearchStatus({ length }) {
  const renderPhrase = () => {
    let phrase = `${length} человек тусанёт `;
    if ([2, 3, 4].includes(length)) {
      phrase = `${length} человека тусанут `;
    }
    return ((length === 0)
      ? <span className="badge bg-danger m-2">Никто с тобой не тусанёт</span>
      : <span className="badge bg-primary m-2">{phrase}с тобой сегодня</span>
    );
  };

  return <>{renderPhrase()}</>;
};

SearchStatus.propTypes = {
  length: PropTypes.number
};

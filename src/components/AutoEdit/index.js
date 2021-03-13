import React, { useState, useEffect } from 'react';

const AutoEdit = ({ children, editCom, defaultEdit = false }) => {
  const [editStatus, setEditStatus] = useState(false);

  useEffect(() => {
    setEditStatus(defaultEdit);
  }, []);

  return <div onClick={() => setEditStatus(!editStatus)}>{editStatus ? editCom : children}</div>;
};

export default AutoEdit;

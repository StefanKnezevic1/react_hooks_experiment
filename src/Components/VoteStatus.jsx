import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { useTable } from 'react-table';
import { DAOContext } from '../pages/index.jsx';


function VoteStatus(props){

  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);
  const {socketContract} = useContext(DAOContext);
//{props.value[props.index]["Voted"] ? "Approved":"Pending"}
  return(
    <p> </p>

  )
}

export default VoteStatus;

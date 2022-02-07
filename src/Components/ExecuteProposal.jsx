import React, { useState, useEffect, useMemo, useContext } from "react";
import { DAOContext } from '../pages/index.jsx';

export default function ExecuteProposal(props){
  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);

  const executeProposal = async () =>{
    await contract.methods.executeProposal(props.index.id).send({from:connectedAddress});
  }

  return(
    <div>
    <button onClick={executeProposal}>
      Execute Proposal
    </button>
    </div>
  )

}

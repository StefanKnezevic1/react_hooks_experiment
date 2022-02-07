import React, { useState, useEffect, useMemo, useContext } from "react";
import { DAOContext } from '../pages/index.jsx';

export default function Vote(props){
  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);

  const doVote = async () => {
    console.log(typeof parseInt(props.index.id));
    console.log("here");
    await contract.methods.vote(parseInt(props.index.id)).send({from:connectedAddress});
  }


  return(
    <button onClick={doVote}>
      Vote
    </button>
  )

}

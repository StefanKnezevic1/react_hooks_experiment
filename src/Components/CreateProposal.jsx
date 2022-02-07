import React, { useState, useEffect, useContext} from "react";
import { Modal } from 'react-bootstrap';
import { DAOContext } from '../pages/index.jsx';

function TransferShares(){
  const [show, setShow] = useState(false);
  const [availableShares, setAvailableShares] = useState(null);
  const [nameInput, setNameInput] = useState("123");
  const [amountInput, setAmountInput] = useState(null);
  const [addressInput, setAddressInput] = useState("123");

  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);

  const handleShow = () => setShow(!show);
  const handleNameInput = (e) => setNameInput(e.target.value);
  const handleAmountInput = (e) => setAmountInput(e.target.value);
  const handleAddressInput = (e) => setAddressInput(e.target.value);

  const createProposal = async () =>{
    const txHash = await contract.methods.createProposal(nameInput, amountInput,addressInput).send({from:connectedAddress, gas:1000000});
    console.log(txHash);
  }

  useEffect(() => {
    const init = async () =>{
      if (contract != undefined){
        const availableShares = await contract.methods.availableFunds().call({from:accounts[5]});
        setAvailableShares(availableShares);
      }
    }
    init();
  },[show, contract])

  return(
    <div>
      <button onClick={handleShow}> Create Proposal </button>
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={handleShow}>
          <Modal.Title> Create Proposal </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5> Available Shares: {availableShares} </h5>
          <input onChange={e => handleNameInput(e)} placeholder="Proposal Name"/>
          <br></br>
          <input onChange={e => handleAmountInput(e)} placeholder="Proposal Amount"/>
          <br></br>
          <input onChange={e => handleAddressInput(e)} placeholder="Proposal Address"/>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              handleShow()
              createProposal()
            }}>
            Submit
          </button>
          <button onClick={handleShow}> Close </button>
        </Modal.Footer>
      </Modal>
    </div>
  )

}


export default TransferShares;

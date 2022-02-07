import React, { useState, useEffect, useContext} from "react";
import { Modal } from 'react-bootstrap';
import { DAOContext } from '../pages/index.jsx';

function TransferShares(){

  const [show, setShow] = useState(false);
  const [addressInput, setAddressInput] = useState("123");
  const [availableShares, setAvailableShares] = useState(null);
  const [amountInput, setAmountInput] = useState(null);

  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);

  const handleShow = () => setShow(!show);
  const handleAddressInput = (e) => setAddressInput(e.target.value);
  const handleAmountInput = (e) => setAmountInput(e.target.value);
  const handleTransfer = () =>{
    //So the way this should work is:
    //User A who wants to make a deal with User B to buy some of his shares will input User B's address
    //and the amount he wants to buy. This won't execute any blockchain functions, instead it will produce a message
    //that we should deal with in the backend. User A will sign this message with his private key
    //User B will receive this request for a transfer from User A, he will verify the signature, ensuring that User A
    //Actually sent this message, if he desires to make the transfer, he will send a signed message himself saying yes
    //Otherwise he will send a signed message saying no. This pair of message will then be processed and the proper
    //blockchain function will be executed to satisfy both parties...

    //I don't know what it means when he says sign message to the public blockchain in the same way that you sign
    //transaction to the public blockchain


    //I won't work on this just yet...
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
      <button onClick={handleShow}> Request Transfer Shares </button>
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={handleShow}>
          <Modal.Title> Request Transfer Shares </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5> Available Shares: {availableShares} </h5>
          <input onChange={e => handleAddressInput(e)} placeholder="address"/>
          <br></br>
          <input onChange={e => handleAmountInput(e)} placeholder="amount"/>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              handleShow()
              handleTransfer()
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

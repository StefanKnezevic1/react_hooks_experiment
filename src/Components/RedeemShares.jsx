import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { DAOContext } from '../pages/index.jsx';

function RedeemShares(){
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("123");
  const [availableShares, setAvailableShares] = useState(null);

  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);

  const handleShow = () => setShow(!show);
  const handleInput = (e) => setInput(e.target.value);
  const redeemShares = async () => {
    await contract.methods.redeemShare(input).send({from:connectedAddress});
  }

  //Figure out how to deal with the 'Cannot read properties of null (reading 'methods')' error
  //Figure out how to only run this useEffect when I want to run it
  //The reason we are getting those three errors is because this useEffect is running before
  //the web3 varibale is passed through the useContext hook, therefore it isn't defined here until after
  //This error is purley because I have a poor understanding of React Hooks....
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
      <button onClick={handleShow}> Redeem Shares </button>
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={handleShow}>
          <Modal.Title> Redeem Shares </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5> Available Shares: {availableShares} </h5>
          <input onChange={e => handleInput(e)} />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              handleShow()
              redeemShares()
            }}>
            Submit
          </button>
          <button onClick={handleShow}> Close </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RedeemShares;

import React, { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { DAOContext } from '../pages/index.jsx';

function Contribute(){
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("123")
  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);
  const handleShow = () => setShow(!show);
  const handleInput = (e) => setInput(e.target.value);
  const contribute = async () => {
    const balance = parseInt(web3.utils.toWei(input)).toString();
    await contract.methods.contribute().send({from:connectedAddress, value:balance, gas:1000000});
  }

  return(
    <div>
      <button onClick={handleShow}> Contribute </button>
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={handleShow}>
          <Modal.Title> Contribute </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input onChange={e => handleInput(e)} />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              handleShow()
              contribute()
            }}>
            Submit
          </button>
          <button onClick={handleShow}> Close </button>
        </Modal.Footer>
      </Modal>
    </div>
  )

}

export default Contribute;

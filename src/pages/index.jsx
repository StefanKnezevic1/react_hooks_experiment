import React, { useState, useEffect, createContext } from "react";
import DAO from "../Contracts/DAO.json";
import Web3 from 'web3';
import Contribute from '../Components/Contribute';
import RedeemShares from '../Components/RedeemShares';
import TransferShares from "../Components/TransferShares";
import CreateProposal from "../Components/CreateProposal";
import VotingTable from "../Components/VotingTable";

export const DAOContext = createContext(null);

function MainPage() {
  const [web3, setWeb3] = useState(undefined);
  const [socketWeb3, setSocketWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [socketContract, setSocketContract] = useState(undefined);
  const [connectedAddress, setConnectedAddress] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum){
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3){
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else{
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
      }
      const web3 = new Web3(window.ethereum);
      const socketWeb3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DAO.networks[networkId];
      const contractAddress = deployedNetwork.address;

      const dao = new web3.eth.Contract(DAO.abi, contractAddress);
      const socketContract = new socketWeb3.eth.Contract(DAO.abi, contractAddress);
      const connectedAddress = await window.web3.currentProvider.selectedAddress;

      const available = await dao.methods.availableFunds().call({from:accounts[0]});
      const balance = await web3.eth.getBalance(contractAddress);
      const totalShares = await dao.methods.totalShares().call({from:accounts[0]});

      console.log("Balance: ",balance);
      console.log("Total Shares: ",totalShares);
      console.log("Available Shares: ",available);
      console.log(connectedAddress)
      setWeb3(web3);
      setAccounts(accounts);
      setContract(dao);
      setSocketContract(socketContract);
      setConnectedAddress(connectedAddress);
      setContractAddress(contractAddress);
    }
    init();
  }, []);




  return (
    <DAOContext.Provider value={{web3, accounts,contract,connectedAddress, contractAddress, socketContract}}>
    <Contribute />
    <RedeemShares />
    <TransferShares />
    <CreateProposal />
    <VotingTable />
    </DAOContext.Provider>
  );
}

export default MainPage

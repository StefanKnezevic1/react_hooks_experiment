import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { useTable } from 'react-table';
import { DAOContext } from '../pages/index.jsx';
import Vote from './Vote.jsx';
import ExecuteProposal from "./ExecuteProposal";
import Countdown from "./Countdown.jsx";
import VoteStatus from './VoteStatus.jsx';

function VotingTable(){
  const[proposals, setProposals] = useState([]);
  const[votes, setVotes] = useState([]);

  const {web3} = useContext(DAOContext);
  const {accounts} = useContext(DAOContext);
  const {contract} = useContext(DAOContext);
  const {connectedAddress} = useContext(DAOContext);
  const {contractAddress} = useContext(DAOContext);
  const {socketContract} = useContext(DAOContext);

  //Normally, there is some sort of event initializer, button click, submit form, etc. that calls a function to perform
  //a task/set a variable with setState(). This setState() function is asynchonous and it's change won't be displayed on the web
  //page if it is rendered, the only way to recover this change is if you use a useEffect() hook with the desired return variable
  //to activate the useEffect() once it has changed. This way you dynamically render the useState() variable

  //In this case we retreive our events from the events emitted from the smart contract and they are picked up through our web socket
  //We can only do this with a useEffect(), therefore we need two useEffects for the voting values
  //For the proposal values we are "calling" them when we render the table


  //This useEffect will grab all of the past proposals through events and listen to new events
  //console.log("Re-Render");
  const getProposals = async (myCallback) =>{
    if (socketContract != undefined && connectedAddress != undefined){
      var arr = [];
      const initialProposalId = await contract.methods.nextProposalId().call({from:accounts[8]});

      socketContract.events.proposalEdit({fromBlock:0}, function(error,event){
        if (error){console.log(error)}
        const newProposal = {"id":event.returnValues.id,
                             "name":event.returnValues.name,
                             "amount":event.returnValues.amount,
                             "recipient":event.returnValues.recipient,
                             "votes": event.returnValues.votes,
                             "executed":event.returnValues.executed ? "executed": "not executed",
                             "end":event.returnValues.end
                            };
        console.log("-------------------Running---------------");
        arr.push(newProposal);
        console.log("Event ID: ",event.returnValues.id);
        console.log("Prop ID: ",initialProposalId);
        if (event.returnValues.id >= initialProposalId){
          console.log("Callback getting called");
          myCallback(arr);
        }
      });
    }
  }

  const getVotes = async(myCallback) => {
    if (socketContract != undefined && connectedAddress != undefined){
      var arr = [];
      const castVotesNumber = await contract.methods.numberOfVotes(connectedAddress).call({from:accounts[8]});

      socketContract.events.emitVote({fromBlock:0}, function(error, event){
        if (error){console.log(error)}
        const newVote = {"ProposalId" :event.returnValues.proposalId,
                         "Sender": event.returnValues.sender,
                         "Voted": event.returnValues.voted};

        if (newVote["Sender"].toString().toLowerCase() == connectedAddress){
          arr.push(newVote);
          if (arr.length >= castVotesNumber){
            myCallback(arr);
          }
        }
      });
    }
  }

  const populateVote = async(newVote) => {
    const proposalId = await contract.methods.nextProposalId().call({from:accounts[8]}); //is 4
    var castVotes = newVote;
    if (castVotes.length !== proposalId){
      for (var i =0;i<proposalId;i++){
        try{
          if (castVotes[i]["ProposalId"] !== i){
            const difference = i - castVotes[i]["ProposalId"];
            for (var j=0; j<difference;j++){
              castVotes.splice(j+i,0,{"ProposalId" :j+i,"Sender": connectedAddress,"Voted": false});
            }
          }
        }
        catch(e) {
          const difference = proposalId - castVotes.length;
          for (var j=0; j<difference;j++){
            castVotes.push({"ProposalId" :(j+i).toString(),"Sender": connectedAddress,"Voted": false});
          }
        }
      }
    }
    if (votes.length < castVotes.length){
      setVotes(castVotes);
    }

  }



  useEffect(() => {
    const init = async () => {
      getVotes(newVote => {
        console.log("Here");
        populateVote(newVote)
      });

    }
    init();
  },[socketContract,connectedAddress])



  useEffect(() => {
    const init = async () => {
      getProposals(newProp => {
        setProposals(newProp);
      });
    }
    init();
    console.log(proposals)
  }, [socketContract,connectedAddress])



  //const votesData = useMemo(() => [...votes], [votes]);
  //Apparently useMemo() is the only option here, not totally sure why jsut yet, should do more research on this...
  //Setting up the Header & accessor for the columns information
  const proposalsData = useMemo(() => [...proposals],[proposals]);
  const proposalsColumns = useMemo(() => proposals[0] ? Object.keys(proposals[0]).filter((key) => key !== "rating").map((key) =>{
    return {Header: key, accessor: key};
  }) : [] , [proposals]);
  //console.log(votesData);

  const voteHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      { id:"Vote State",
        Header: "Vote State",
        Cell: ({row}) =>(<VoteStatus index={row.id} value={votes}/>),
      },
      { id:"Countdown",
        Header: "Time Remaining",
        Cell: ({row}) =>(<Countdown futureTime={proposals[row.id]["end"]}/>),
      },
      { id:"Vote Button",
        Header: "Vote",
        Cell: ({row}) =>(<Vote index={row}/>),
      },
      { id:"Execute Button",
        Header: "Execute",
        Cell:({row}) =>(<ExecuteProposal index={row}/>),
      },
    ]);
  };

  //Create a table instance with 'useTable()' from react-table
  const tableInstance = useTable({columns: proposalsColumns, data:proposalsData}, voteHooks);
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;

  //console.log("proposals",proposals[0]);
  //render the table information and populate with desired data
  return(
    <div>
    <table {...getTableProps()}>
      <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) =>(
            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) =>{
          prepareRow(row);
          return <tr {...row.getRowProps()}>
           {row.cells.map((cell,idx) => (
            <td  {...cell.getCellProps()}> {cell.render("Cell")} </td>
          ))}
          </tr>
        })}
      </tbody>
    </table>
    </div>
  )

}
export default VotingTable;

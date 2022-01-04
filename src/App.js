import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/Random.json";

function App() {

  const[currAccount,setCurrentAccount] = React.useState("");
  const[guess,setGuess] = React.useState(0);
  const contractAddress = "0x99c0a87944d1D1bA2D93eaB4F1a09605ab83Dc96";
  const contractABI =  abi.abi;


  const onChangeHandler = event => {
    setGuess(event.target.value);
  };

  async function connect(){
    let provider = window.ethereum;
    if (typeof provider !== 'undefined') {
       console.log('MetaMask is installed!');
       const accounts = await provider.request({ method: 'eth_requestAccounts' });
       const account = accounts[0];
       setCurrentAccount(account);
    }
    
  }


async function play(){
  let provider = window.ethereum;
  if(provider){

  const connection = new ethers.providers.Web3Provider(provider);
  const signer = connection.getSigner();
  const RandomContract = new ethers.Contract(contractAddress, contractABI, signer);
  RandomContract.on("Result",(game)=>{
    console.log("event called");
    console.log(game);

 }
 );
  console.log(guess);
   const tx = await RandomContract.getRandomNumber(guess,{gasLimit:300000});
   await tx.wait();

  }
  
}

  return (
    <div className="App-container">
      <div>
        <div>
          Let's play! Choose a random number between 1 and 100
        </div>
      <form > 
        <input className ="App-inputText"
          type="number" placeHolder = "Enter a number between 1 and 100" min="1" max="100" pattern="[0-9]+" onChange={ onChangeHandler}
        />
    </form>
    {
      currAccount?(
      <button className="App-button" onClick = {play}>
          Play
        </button>
      ):(
        <button className="App-button" onClick ={connect}>
        Connect MetaMask Wallet       🦊
      </button>
      )
    }
    
       
  
   
      </div>
    </div>
  );
}

export default App;

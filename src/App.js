import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/Random.json";
import RingLoader from "react-spinners/RingLoader";

function App() {

  const[currAccount,setCurrentAccount] = React.useState("");
  const[guess,setGuess] = React.useState(0);
  const contractAddress = "0x0A65D14ae30915eB0C2778327ef98cd39119C15d";
  const contractABI =  abi.abi;
  const[loading, setLoading] = React.useState(false);
  const[result, setResult] = React.useState("");


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

 function replay(){
   setResult("");
 }

function renderInput(){

  if(loading){
      return (<div> <p className = "gradient-text">
      <br/><br/>
        Wait, The smart contract is generating a random number
        </p>
        <RingLoader className="App-loader" color="#ff6fdf" loading={loading}  size={50} />
        </div>)
  }else if(!loading && !result){
  return (<div> <form > 
    <input className ="App-inputText"
      type="number" placeholder = "Enter a number between 1 and 100" min="1" max="100" pattern="[0-9]+" onChange={ onChangeHandler}
    />
</form>
<button className="App-button" onClick = {play}>
  Play
</button></div>
)
  }
  if(!loading && result){
    return (<div>
      <p className = "gradient-text">
    <br/><br/>
      Okay, the result is available
      </p>
      <button className ="result" onClick ={replay}>
     <p>Your guess: {result.playerGuess}</p>
     <p>Random number: {result.randomNumber}</p>
     <p>Palayer id: {result.player}</p>
     <p><br/> Click to guess again</p>
   </button>
    </div>
      )
  }

}

async function play(){
  let provider = window.ethereum;
  try {
    if(provider){

      const connection = new ethers.providers.Web3Provider(provider);
      const signer = connection.getSigner();
      const RandomContract = new ethers.Contract(contractAddress, contractABI, signer);
      RandomContract.on("Result",(game)=>{
        setResult(game)
        setLoading(false);
     }
    
     );

       setLoading(true);
       const tx = await RandomContract.getRandomNumber(guess,{gasLimit:300000});
       await tx.wait();
    
      }
  } catch (error) {
    setLoading(false);
    console.log(error);
  }
  
  
}

  return (
    <div className="App">
    <div className="App-container">
      <div>
        <p className = "sub-text">
        Let's play!<br/><br/>
        Guess a random number between 1 and 100
        </p>
       
    {
      currAccount?renderInput():(
        <button className="App-button" onClick ={connect}>
        Connect MetaMask Wallet       🦊
      </button>
      )
    }
    

      </div>
    </div>
    /</div>
  );
}

export default App;

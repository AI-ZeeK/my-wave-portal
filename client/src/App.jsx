import "./App.css";
import abi from "./utils/WavePortal.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
	try {
		const ethereum = getEthereumObject();

		/*
		 * First make sure we have access to the Ethereum object.
		 */
		if (!ethereum) {
			console.error("Make sure you have Metamask!");
			return null;
		}

		console.log("We have the Ethereum object", ethereum);
		const accounts = await ethereum.request({ method: "eth_accounts" });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account:", account);
			return account;
		} else {
			console.error("No authorized account found");
			return null;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
};

const App = () => {
	const [currentAccount, setCurrentAccount] = useState("");
	/*
	 * All state property to store all waves
	 */
	const [allWaves, setAllWaves] = useState([]);
	const contractAddress = "0x39D047f78BE43C88B7b5Fe75e73e46ecDD81Aad6";
	/* Create a variable here that references the abi content!
	 */
	const contractABI = abi.abi;
	/*
	 * Create a method that gets all waves from your contract
	 */
	const getAllWaves = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				/*
				 * Call the getAllWaves method from your Smart Contract
				 */
				const waves = await wavePortalContract.getAllWaves();

				/*
				 * We only need address, timestamp, and message in our UI so let's
				 * pick those out
				 */
				const wavesCleaned = waves.map((wave) => {
					return {
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message,
					};
				});
				// waves.forEach((wave) => {
				// 	wavesCleaned.push({
				// 		address: wave.waver,
				// 		timestamp: new Date(wave.timestamp * 1000),
				// 		message: wave.message,
				// 	});
				// });

				/*
				 * Store our data in React State
				 */
				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const ethereum = getEthereumObject();
			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.error(error);
		}
	};
	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				/*
				 * You're using contractABI here
				 */
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());

				/*
				 * Execute the actual wave from your smart contract
				 */
				const waveTxn = await wavePortalContract.wave("this is a message", {
					gasLimit: 300000,
				});
				console.log("Mining...", waveTxn.hash);

				await waveTxn.wait();
				console.log("Mined -- ", waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count...", count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};
	/*
	 * This runs our function when the page loads.
	 * More technically, when the App component "mounts".
	 */
	// useEffect(
	// 	() => async () => {
	// 		const account = await findMetaMaskAccount();
	// 		if (account !== null) {
	// 			setCurrentAccount(account);
	// 		}
	// 	},
	// 	[]
	// );
	useEffect(() => {
		let wavePortalContract;

		const onNewWave = (from, timestamp, message) => {
			console.log("NewWave", from, timestamp, message);
			setAllWaves((prevState) => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message,
				},
			]);
		};
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			wavePortalContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);
			wavePortalContract.on("NewWave", onNewWave);
		}

		return () => {
			if (wavePortalContract) {
				wavePortalContract.off("NewWave", onNewWave);
			}
		};
	}, []);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Hey there!</div>

				<div className="bio">
					I am farza and I worked on self-driving cars so that's pretty cool
					right? Connect your Ethereum wallet and wave at me!
				</div>

				<button className="waveButton" onClick={wave}>
					Wave at Me
				</button>

				{!currentAccount && (
					<button className="waveButton" onClick={connectWallet}>
						Connect Wallet
					</button>
				)}

				{allWaves.map((wave, index) => {
					return (
						<div 
							key={index}
							style={{
								backgroundColor: "OldLace",
								marginTop: "16px",
								padding: "8px",
								color: "black"
							}}>
							<div>Address: {wave.address}</div>
							<div>Time: {wave.timestamp.toString()}</div>
							<div>Message: {wave.message}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default App;

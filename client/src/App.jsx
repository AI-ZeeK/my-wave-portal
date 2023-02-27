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
		console.log(ethereum, accounts);

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
				console.log(
					waves,
					wavesCleaned,
					contractABI,
					ethereum,
					signer,
					provider,
					wavePortalContract
				);

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
				console.log(
					waveTxn,
					count,
					contractABI,
					ethereum,
					signer,
					provider,
					wavePortalContract
				);
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
				<div className="card-edge"></div>
				<div className="card-edge2"></div>
				<div className="circle-box"></div>
				<div className="circle-box2"></div>
				<div className="circle-box3"></div>
				<div className="circle-box4"></div>
				<div className="circle-box5"></div>
				<div className="circle-box6"></div>
				<div className="circle-box-3"></div>
				<div className="circle-box-4"></div>
				<div className="circle-box-5"></div>
				<div className="circle-box-6"></div>
				<div className="circle-box7"></div>
				<div className="circle-box8"></div>
				<div className="circle-box9"></div>
				<div className="circle-box10"></div>
				<div className="circle-box11"></div>
				<div className="circle-box12"></div>
				<div className="circle-box-9"></div>
				<div className="circle-box-10"></div>
				<div className="circle-box-11"></div>
				<div className="circle-box-12"></div>
				<div className="dot1"></div>
				<div className="dot2"></div>
				<div className="dot3"></div>
				<div className="dot4"></div>
				<div className="dot5"></div>
				<div className="dot6"></div>
				<h1 className="header">👋 Hey there!</h1>

				<div className="bio">
					I am Isaac and I work on Web3 projects so that's pretty cool right?{" "}
					<br /> Connect your Ethereum wallet and wave at me!
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
						<div className='waves-array'
							key={index}
							style={{
								backgroundColor: "OldLace",
								marginTop: "16px",
								padding: "12px",
								color: "black",
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

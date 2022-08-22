import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ABI from "../../../abi.json"
import Image from "next/image"
import balanceABI from "../../../mumbaiAbi.json"
import Publications from "./[publications]"
import { useRouter } from "next/router"
import { client, getProfile } from "../../../api"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { address } from "../../../constants"
import { balanceCheck } from "../../../constants"


export default function Profile() {
	const [profile, setProfile] = useState()
	const [tipModal, setTipModal] = useState(false)
	const [balance, setBalance] = useState("")
	const [profileAddress, setProfileAddress] = useState("")
	const [userAddress, setUserAddress] = useState("")
	const [tipAmount, setTipAmount] = useState("")
	const router = useRouter()
	const { id } = router.query

	useEffect(() => {
		if (id) {
			fetchProfile()
			getAddress()
		}
	}, [id])

	useEffect(() => {
		getBalance()
	}, [userAddress])

	useEffect(() => {
		if(window.ethereum) {
		  window.ethereum.on('accountsChanged', () => {
			window.location.reload();
		})
	}})

	async function fetchProfile() {
		try {
			const response = await client.query(getProfile, { id }).toPromise()
			setProfile(response.data.profile)
			setProfileAddress(response.data.profile.ownedBy)
		} catch(err) {
			console.log({ err })
		}
	}

	async function followUser() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()

		const contract = new ethers.Contract(
			address,
			ABI,
			signer
		)

		try {
			const tx = await contract.follow(
				[id], [0x0]
			)
			await tx.wait()
			console.log("followed user...")
		} catch (error) {
			console.log("Error following: ", error)
		}
	}

	async function getAddress() {
		const [accounts] = await window.ethereum.request({
			method: "eth_requestAccounts"
		})
		console.log(accounts)
		setUserAddress(accounts)
	}

	async function getBalance() {
		const account = [userAddress]
		const tokens = ["0x0000000000000000000000000000000000001010"] // should be Matic
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()

		const contract = new ethers.Contract(
			balanceCheck,
			balanceABI,
			signer
		)

		try {
			let balance = await contract.balances(account, tokens)
			let decimal = ethers.utils.formatEther(balance[0]._hex)
			setBalance(decimal.slice(0,5))
		} catch (error) {
			console.log("error:", error)
		}
	}

	const handleChange = event => {
		const result = event.target.value
		setTipAmount(result)
	}

	async function executeTip() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()


		const tx = {
			from: userAddress,
			to: profileAddress,
			value: ethers.utils.parseEther(tipAmount),
			nonce: provider.getTransactionCount(userAddress, "latest"),
			gasLimit: ethers.utils.hexlify(30000),
			gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
		}

		signer.sendTransaction(tx)
	}

	if (!profile) return null

	return (
		<Layout>
		<Header/>
		<div>
		<h2 className="font-mono text-3xl pt-4 pl-2" >{profile.handle}</h2>
			{
				profile.picture ? (
					<div className="pl-10 pt-3">
						<Image width={"200px"} height={"200px"} className="rounded-full border" src={profile.picture.original.url}/>
					</div>
				) : (
					<div className="pl-10 pt-3">
						<div style={{ width: '200px', height: '200px', backgroundColor: 'black'}} className="rounded-full border"/>
					</div>
				)
			}
			<div className="pl-20">
			<p className="pl-2 pb-2 pt-2 font-mono">Followers: {profile.stats.totalFollowers}</p>
			</div>
			<div className="pl-5">
				<button onClick={followUser} type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-m px-5 py-2.5 text-center mr-2 mb-2">Follow</button>
				<button onClick={() => setTipModal(true)} type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-m px-5 py-2.5 text-center mr-2 mb-2">Tip</button>
			</div>
			<div className="flex items-center justify-center">
				{
					tipModal ? (
						<div className="border-2 border-purple-900 rounded-lg grid h-60 w-80 place-items-center">
							<h2 className="text-center font-mono">
								Please choose your currency + tipping amount
							</h2>
							<p className="font-mono">Your MATIC balance: {balance}</p>
							<input placeholder="insert amount" className="border-2 border-gray-300 rounded-lg focus:border-2 focus:border-purple-900" type="number" value={tipAmount} onChange={handleChange}>
							</input>
							{
								tipAmount > balance ? (
									<p className="font-mono font-red-300 text-center text-red-500">Tip amount is greater than wallet balance!</p>
								) : ("")
							}
							<button
								className="bg-white-500 hover:bg-gray-200 text-black font-bold py-2 px-4 border border-black disabled:cursor-not-allowed rounded-full"
								disabled={tipAmount > balance}
								onClick={executeTip}>
							<span role="img" aria-label="cheers">🍻</span>
							Tip!
							</button>
							<button
								className="bg-white-500 border-2 border-gray-300 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-full"
								onClick={() => setTipModal(false)}>
							Close
							</button>
						</div>
					) : null
				}
			</div>
			<div className="pl-5 pt-4">
				<p className="font-mono">{profile.bio}</p>
			</div>
			<Publications>
			</Publications>
		</div>
		<Footer/>
		</Layout>
	)
}
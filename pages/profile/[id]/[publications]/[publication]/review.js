import ABI from "../../../../../abi.json"
import Moralis from "moralis"
import Router from "next/router"
import Layout from "../../../../../components/Layout"
import Header from "../../../../../components/Header"
import Footer from "../../../../../components/Footer"
import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { serverUrl } from "../../../../../constants"
import { appId } from "../../../../../constants"
import { address } from "../../../../../constants"
import { v4 as uuid } from "uuid"
import { ethers } from "ethers"
import { ProfileContext } from "../../../../../components/ProfileContext"

function Review() {
	let ipfsLink = ""
	const router = useRouter()
	const [account, setAccount] = useState()
	const [ownedProfiles, setOwnedProfiles] = useState([])
	const [selected, setSelected] = useState(-1)
	const { id } = router.query
	const { publication } = router.query
	const { profile } = useContext(ProfileContext)

	useEffect(() => {
		connect()
	})

	// useEffect(() => {
	// 	fetchOwnedProfiles()
	// }, [account])


	Moralis.start({ serverUrl, appId })

	async function connect() {
		const [accounts] = await window.ethereum.request({
			method: "eth_requestAccounts"
		})
		setAccount(accounts)
	}

	function getSigner() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		return provider.getSigner();
	}

	// async function fetchOwnedProfiles() {
	// 	try {
	// 		const response = await client.query(ownedBy, {"address": account}).toPromise()
	// 		setOwnedProfiles(response.data.profiles.items)
	// 	} catch (error) {
	// 		console.log("error:", error)
	// 	}
	// }

	async function uploadReview() {
		const content = document.getElementById("metadataContent").value
		const name = document.getElementById("metadataName").value

		const metadata = {
			"version": "1.0.0",
			"metadata_id": uuid(),
			"content": content,
			"name": name,
			"attributes": [],
			"appId": "lenspad"
		}

		const str = btoa(unescape(encodeURIComponent(JSON.stringify(metadata))))
		const review = new Moralis.File("review.json", {base64 : str})
		await review.saveIPFS()
		ipfsLink = review.ipfs()
	}

	function getPubId(){
		const start = publication.indexOf("-") + 1
		let pubId = publication.substring(start, publication.length)
		return pubId
	}

	async function sendComment() {
		await uploadReview()
		const pubId = getPubId()
		const contentURI = ipfsLink
		const contract = new ethers.Contract(
			address,
			ABI,
			getSigner()
		)
		try {
			const commentData = {
				profileId: profile.id,
				contentURI: contentURI,
				profileIdPointed: id,
				pubIdPointed: pubId,
				referenceModuleData: 0x0,
				collectModule: '0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c',
				collectModuleInitData: ethers.utils.defaultAbiCoder.encode(['bool'], [true]),
				referenceModule: '0x0000000000000000000000000000000000000000',
				referenceModuleInitData: []
			}
			const tx = await contract.comment(commentData)
			await tx.wait()
			console.log("successfully commented!")
			Router.reload(window.location.pathname)
		} catch (error){
			console.log("Error while commenting:", error)
		}
	}

	return (
		<Layout>
			<Header/>
				<div>
					<div>
						<h2 className="font-mono text-m pt-4 pl-2">Short and Spicy Review Title</h2>
					</div>
					<div className="pl-2">
						<label for="name" className="block mb-2 text-sm font-mono text-gray-900 dark:text-gray-300"></label>
						<input type="text" name="metadataName" id="metadataName" className="bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey-900 dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-2" placeholder="Title" required/>
					</div>
						<h2 className="font-mono text-m pl-2 pt-2">Review</h2>
					<div className="pl-2">
						<label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"></label>
							<textarea name="metadataContent" id="metadataContent" rows="4" className="block p-2.5 w-80 h-80 text-m text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey-90 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Review"></textarea>
					</div>
					<div className="pl-2 pt-2">
						<button type="button" onClick={sendComment} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-600 font-mono rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Publish Review</button>
					</div>
				</div>
			<Footer/>
		</Layout>
	)
}

export default Review
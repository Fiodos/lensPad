import Link from "next/link"
import ABI from "../../../../abi.json"
import { useRouter } from "next/router"
import { client, getPublications, getProfile } from "../../../../api"
import { React, useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, Button } from "semantic-ui-react"
import { address } from "../../../../constants"


function Publications() {
	const [publications, setPublications] = useState([])
	const [handle, setHandle] = useState("")
	const router = useRouter()
	const { id } = router.query

	// This way,the publications are shown, even after a refresh!
	useEffect(() => {
		if (id) {
			fetchPublications()
			getHandle()
		}
	}, [id])

	async function getPubId(index){
		let pubId = publications[index].id
		const start = pubId.indexOf("-") + 1
		pubId = pubId.substring(start, pubId.length)
		return pubId
	}

	async function fetchPublications() {
		try {
			const response = await client.query(getPublications, { id }).toPromise()
			setPublications(response.data.publications.items)
		} catch (error) {
			console.log("Error fetching publications:", error)
		}
	}

	async function getHandle() {
		try {
			const response = await client.query(getProfile, { id }).toPromise()
			console.log("response:", response)
			setHandle(response.data.profile.handle)
		} catch (error) {
			console.log("Error fetching handle:", error)
		}
	}

	function getSigner() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		return provider.getSigner();
	}

	const collectPublication = async (index) => {
		const pubId = getPubId(index)
		const contract = new ethers.Contract(
			address,
			ABI,
			getSigner()
		)

		try {
		const tx = await contract.collect(
			id,
			pubId,
			0x0
		)
		await tx.wait()
		console.log("Successfully collected publication!")
		} catch (error) {
			console.log("Error collecting publication:", error)
		}
	}

	return (
		<div className="pl-5">
			<h2 className="pt-4 font-mono font-bold text-lg">Lenspad publications by { handle } 🖊️</h2>
			{
				publications.map((publication, index) => (
					/*publication.appId === "lenspad" ? */(
					<div className="pl-10">
						<Card style={{ margin: 10 }}>
							<h4 className="font-mono font-bold pt-2 pb-2 pl-2">{publication.metadata.name}</h4>
							<p className="font-mono pt-2 pb-2 pl-2">{publication.metadata.description}</p>
							<div className="pt-2 pl-6">
								<Link href={`/profile/${id}/publications/${publications[index].id}`}>
									<button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2">View Publication</button>
								</Link>
								<button onClick={() => collectPublication(index)} type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3.5 py-2.5 text-center mr-2 mb-2">Collect Publication</button>
							</div>
						</Card>
					</div> )/* : (<div/>)*/
				))
			}
		</div>
	)
}

export default Publications
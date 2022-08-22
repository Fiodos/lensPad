import Link from "next/link"
import ABI from "../../../../../abi.json"
import Router from "next/router"
import Layout from "../../../../../components/Layout"
import Header from "../../../../../components/Header"
import Footer from "../../../../../components/Footer"
import { useRouter } from "next/router"
import { client, getPublication, getOwnership, getComments, getProfile} from "../../../../../api"
import { React, useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, Button } from "semantic-ui-react"
import { address } from "../../../../../constants"


function Publication() {
	const router = useRouter()
	const [owner, setOwner] = useState(false)
	const [content, setContent] = useState("")
	const [pubName, setPubName] = useState("")
	const [comments, setComments] = useState([])
	const [cover, setCover] = useState()
	const [img, setImg] = useState()
	const [handle, setHandle] = useState()
	const [uri, setUri] = useState()
	const { publication } = router.query
	const { id } = router.query


	useEffect(() => {
		if (publication) {
			fetchOwnership()
			fetchPublication()
			fetchComments()
		}
	})

	useEffect(() => {
		if (id)
			fetchProfile()
	})

	async function getPubId(){
		let pubId = publication
		const start = pubId.indexOf("-") + 1
		pubId = pubId.substring(start, pubId.length)
		return pubId
	}

	function getSigner() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		return provider.getSigner();
	}

	async function fetchOwnership() {
		const pubId = await getPubId()
		const signer = getSigner()
		const contract = new ethers.Contract(
			address,
			ABI,
			signer
		)
		const signerAddress = await signer.getAddress()
		const nftContract = await contract.getCollectNFT(id, pubId)
		try{
			const response = await client.query(
				getOwnership,
				{"user": signerAddress,
				"nft": nftContract}).toPromise()
			if (response.data.nfts.items.length) {
				setOwner(true)
			} else {
				setOwner(false)
			}
		} catch (error) {
			console.log("Error fetching ownership:", error)
		}
	}

	function download(url, filename) {
		fetch(url).then(function(t) {
			return t.blob().then((b)=>{
				var a = document.createElement("a")
				a.href = URL.createObjectURL(b)
				a.setAttribute("download", filename)
				a.click()
			}
			)
		})
	}

	async function fetchProfile() {
		try {
			const response = await client.query(getProfile, {"id": id}).toPromise()
			setHandle(response.data.profile.handle)
			setImg(response.data.profile.picture.original.url)
		} catch (error) {
			console.log("Error while fetching profile:", error)
		}
	}

	async function fetchPublication() {
		try {
			const response = await client.query(getPublication, {"pubId": publication}).toPromise()
			setContent(response.data.publication.metadata.content)
			setPubName(response.data.publication.metadata.name)
			setCover(response.data.publication.metadata.media[0].original.url)
			setUri(response.data.publication.metadata.description)
		} catch (error) {
			console.log("Error fetching publication:", error)
		}
	}

	async function fetchComments() {
		try {
			const response = await client.query(getComments, {"comment": publication}).toPromise()
			setComments(response.data.publications.items)
		} catch (error) {
			console.log("Error while fetching comments:", error)
		}
	}

	async function collectPublication() {
		const pubId = await getPubId()
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
			Router.reload(window.location.pathname)
		} catch (error) {
			console.log("Error collecting publication:", error)
		}
	}

	return (
		<Layout>
			<Header/>
		<div className="p-4">
			<h1 className="font-mono font-bold text-3xl">{pubName}</h1>
			<div className="pl-2 pt-2 pb-2">
				<div className="p-4">
					<img class="object-cover w-full h-full rounded md:h-auto md:w-80 md:rounded-none md:rounded-l-lg" src={cover}/>
				</div>
				<div className="w-50 p-4 border rounded">
					<h2 className="font-mono font-bold pb-4">Description</h2>
					<p className="text-xl">{content}</p>
				</div>
			</div>
			<Link href={`/profile/${id}`}>
				<a>
					<div className="flex p-4">
						<p className="font-mono">written by {handle}</p>
					{
						img != 0 ? (
							<div className="pb-1 pl-1">
								<img src={img} width="20px" height="20px" className="rounded-full border ml-auto" />
							</div>
						) : (<div>🤷</div>)
					}
					</div>
				</a>
			</Link>
			<div></div>
			<div className="pl-2 pt-4">
				<a>
					<button type="button" disabled={!owner} onClick={() => download(uri, pubName)} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-600 font-mono rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 disabled:opacity-50">Download Publication</button>
					<Link href={`/profile/${id}/publications/${publication}/review`}>
						<button type="button" disabled={!owner} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-600 font-mono rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 disabled:opacity-50">Create Review</button>
					</Link>
					<button type="button" onClick={collectPublication} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-600 font-mono rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Collect Publication</button>
				</a>
			</div>
			<div>
				<h1 className="text-2xl font-mono pl-2 pt-4">Reviews</h1>
				{
					comments.length > 0 ? (
						comments.map((comment, index) => (
							<div className="pl-2 pt-2">
								<Card>
									<h4 className="font-mono font-bold pt-2 pl-2">{comment.metadata.name}</h4>
									<Link href={`/profile/${comments[index].profile.id}`}>
										<a>
											<div className="flex">
												<p className="font-mono pb-4 pl-2">by {comments[index].profile.handle}</p>
												<div>
													{
														comments[index].profile.picture.original.url != 0 ? (
															<div className="pl-2">
																<img src={comments[index].profile.picture.original.url} width="20px" height="20px" className="rounded-full border ml-auto"/>
															</div>
														) : (<div>🤷</div>)
													}
												</div>
											</div>
										</a>
									</Link>
									<h4 className="font-mono pl-2 pb-4">{comment.metadata.content}</h4>
								</Card>
							</div>
						))
					) : (<div className="font-mono pl-2 pt-2">No Reviews available</div>)
				}
			</div>
		</div>
		<Footer/>
		</Layout>
	)
}

export default Publication
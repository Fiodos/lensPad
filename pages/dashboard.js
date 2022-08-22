import Image from "next/image"
import Link from "next/link"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { client, getActivity, getPublications } from "../api"
import { InfoContext } from "../components/InfoContext"
import { useContext, useEffect, useState } from "react"
import { Card } from "semantic-ui-react"

function Dashboard() {
	const {info} = useContext(InfoContext)
	const [reviews, setReviews] = useState([])
	const [publications, setPublications] = useState([])

	useEffect(() => {
		fetchReviews()
		fetchPublications()
		console.log("info:", info) //info.stats
	})

	async function fetchReviews() {
		try {
			const response = await client.query(getActivity, {"id": info.id}).toPromise()
			setReviews(response.data.publications.items)
		} catch (error) {
			console.log("Error while fetching activity:", error)
		}
	}

	async function fetchPublications() {
		try {
			const response = await client.query(getPublications, {"id": info.id}).toPromise()
			setPublications(response.data.publications.items)
		} catch (error) {
			console.log("Error fetching publications:", error)
		}
	}

	return (
		<Layout>
			<Header/>
			<div>
				<div className="pt-10 flex flex-col items-center justify-center">
					<h1 className="font-mono font-bold text-xl pb-4">Your Dashboard</h1>
					{
						info.picture.original.url.length > 0 ? (
							<div>
								<Image width={"200px"} height={"200px"} className="rounded-full border" src={info.picture.original.url}/>
							</div>
						) : (
							<div style={{ width: '200px', height: '200px', backgroundColor: 'black'}} className="rounded-full border"/>
						)
					}
					<div>
						{
							info.bio ? (
								<div className="flex flex-col items-center justify-center p-4">
									<p className="font-mono">{info.bio}</p>
								</div>
							) : (<div className="border rounded p-4"><p className="font-mono">No bio available</p></div>)
						}
					</div>
					<div className="flex flex-col items-center justify-center">
						<h2 className="font-mono pb-8 pt-4">Stats</h2>
						<div className="border rounded p-4">
							<h3 className="font-mono pb-2">Total Collects: {info.stats.totalCollects}</h3>
							<h3 className="font-mono pb-2">Total Reviews: {info.stats.totalComments}</h3>
							<h3 className="font-mono pb-2">Followers: {info.stats.totalFollowers}</h3>
							<h3 className="font-mono pb-2">Following: {info.stats.totalFollowing}</h3>
							<h3 className="font-mono pb-2">Publications: {info.stats.totalPublications}</h3>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 place-content-evenly">
				<div className="flex flex-col items-center justify-center h-50">
					<h1 className="font-mono text-lg">Reviews</h1>
						<div className="overflow-auto h-50">
							{
								reviews.length > 0 ? (
									<div className="overflow-auto">
									{
										reviews.map((review, index) => (
											review.mainPost.appId == "lenspad" ? (
												<div className="pt-4">
													<div className="overflow-auto h-40 w-80 border rounded">
														<h4 className="font-mono font-bold pt-2 pb-2 pl-2">{review.metadata.name}</h4>
														<p className="font-mono pt-2 pb-8 pl-2">{review.metadata.content}</p>
													<Link href={`/profile/${reviews[index].mainPost.profile.id}/publications/${reviews[index].mainPost.id}`}>
														<button type="button" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-600 font-mono rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-1 ml-1">Show Original Publication</button>
													</Link>
													</div>
												</div>) : null))
									}
									</div>
								) : (<div className="overflow-auto p-4"><p>No Activity</p></div>)
							}
						</div>
				</div>
				<div className="flex flex-col items-center justify-center h-50">
					<h1 className="font-mono text-lg">Publications</h1>
					<div className="overflow-auto h-50">
						{
							publications.map((publication, index) => (
								publication.appId === "lenspad" ? (
								<div className="pt-4">
											<div className="overflow-auto h-40 w-80 border rounded">
												<a className="cursor-pointer">
													<Link href={`profile/${info.id}/publications/${publications[index].id}`}>
														<h4 className="font-mono font-bold pt-2 pb-2 pl-2">{publication.metadata.name}</h4>
													</Link>
												</a>
												<p className="font-mono pt-2 pb-2 pl-2">{publication.metadata.content}</p>
											</div>
								</div> ) : null
							))
						}
					</div>
				</div>
			</div>
			<Footer/>
		</Layout>
	)
}

export default Dashboard
import Link from "next/link"
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { client, getAllPublications } from "../api"
import { useState, useEffect } from "react"


function Explore() {
	const [publications, setPublications] = useState([])
	const [suggestions, setSuggestions] = useState([])
	const [text, setText] = useState("")


	useEffect(() => {
		fetchPublications()
	}, [])

	async function fetchPublications() {
		try {
			const response = await client.query(getAllPublications).toPromise()
			setPublications(response.data.explorePublications.items)
		} catch (error) {
			console.log(error)
		}
	}

	const onChangeHandler = (text) => {
		let matches = []
		if (text.length > 0) {
			matches = publications.filter(publication => {
				const regex = new RegExp(`${text}`, "gi") //gi == case-insesitive
				return publication.metadata.name.match(regex)
			})
		}
		setSuggestions(matches)
		setText(text)
	}

	return (
		<Layout>
		<Header/>
		<div>
			<h1 className="font-mono text-3xl pt-4 pl-2">Explore Publications</h1>
			{
				publications.map((publication, index) => (
					publication.appId === "lenspad" ? (
					<div>
						<div className="pt-4 pl-2">
							<Link href={`profile/${publication.profile.id}/publications/${publication.id}`}>
								<a class="flex flex-col items-center bg-white border-2 rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 pl-2 border-black hover:cursor-pointer">
								<div>
									{publication.metadata.media.length ?
										<div className="flex pt-4 pl-6">
											<img className="object-fill w-40 rounded-md" src={publication.metadata.media[0].original.url} alt=""/>
										</div> : (<div>NO_PIC</div>)
									}
									<div className="flex flex-col justify-between p-4 leading-normal">
										<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">{publication.metadata.name}</h5>
										<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{publication.metadata.content}</p>
									</div>
								</div>
								</a>
							</Link>
						</div>
					</div> ) : null
				))
			}
		</div>
		<Footer/>
		</Layout>
	)
}

export default Explore
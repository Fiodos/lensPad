import { client, getAllPublications } from "../api"
import { useState, useEffect } from "react"
import styles from "../styles/Custom.module.css"
import Link from "next/link"

function SearchBar() {
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
		<div>
			<div class="flex justify-center">
				<div class="xl:w-96">
					<div class="input-group relative flex flex-wrap items-stretch w-full mb-2 pt-1.5 rounded">
						<input type="text" class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-mono text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white" placeholder="Search publication" aria-label="Search" aria-describedby="button-addon2" onChange={e => onChangeHandler(e.target.value)} value={text}/>
							<span class="bg-black flex items-center px-3 py-1.5 text-base font-normal text-white text-center whitespace-nowrap rounded border border-white" id="basic-addon2">
								<svg aria-hidden="true" focusable="true" data-prefix="fas" data-icon="search" class="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
								</svg>
							</span>
						</div>
					</div>
				</div>
				<div className="bg-white text-black rounded-md w-96 border-2 border-black absolute z-50">
					{suggestions && suggestions.map((suggestion, i) => (
						suggestion.appId === "lenspad" ? (
						<div key={i}>
							<Link href={`/profile/${suggestion.profile.id}/publications/${suggestion.id}`}>
								<a className="hover:text-purple-900 font-mono pl-2">
									{suggestion.metadata.name}
								</a>
							</Link>
						</div>
						) : ("")
					)
					)}
				</div>
		</div>
	)
}

export default SearchBar
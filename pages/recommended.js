import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from "../styles/Custom.module.css"
import { React, useState, useEffect } from 'react'
import {
	client, recommendProfiles, getProfileByName, searchProfiles
} from '../api'

function Home() {
	const [recommended, setRecommended] = useState([])

	useEffect(() => {
		fetchRecommended()
	}, [])

	async function fetchRecommended() {
		try {
			const response = await client.query(recommendProfiles).toPromise()
			setRecommended(response.data.recommendedProfiles)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Layout>
			<Header/>
		<div className="container">
			{
			recommended.map((profile, index) => (
				<div className="grid place-items-center pt-2">
					<div className="card bg-white flex flex-col items-center justify-center p-4 shadow-lg rounded-2xl w-50">
					{
						profile.picture ? (
							<Image
								src={profile.picture.original.url}
								width="60px"
								height="60px"
								className="rounded-full border"
							/>
						) : (
							<div>
								🤷
							</div>

						)
					}
					<Link href={`/profile/${profile.id}`}>
						<a>
							<h4 className="font-mono font-bold" >{profile.handle}</h4>
						</a>
					</Link>
						<p className="text-center">{profile.bio}</p>
					</div>
				</div>
				))
			}
		</div>
		<Footer/>
		</Layout>
	)
}

export default Home
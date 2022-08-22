import Link from "next/link"
import ConnectButton from "./ConnectButton"
import SearchBar from "./SearchBar"
import Nav from "./Nav"
import SelectProfile from "./SelectProfile"
import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "./UserContext"

function Header() {
	const {user, setUser} = useContext(UserContext)

	return (
	<div>
		<header className="bg-black text-white p-1.5">
			<div className="flex justify-between items-center">
				<Link href={"/"}>
					<a className="font-sans font-bold text-xl">
						<span role="img" aria-label="Books">📚</span>
							lensPad
					</a>
				</Link>
				<div className="pl-4">
					<SearchBar/>
				</div>
				<div>
					<Nav/>
				</div>
				<div className="pr-4">
					<SelectProfile/>
				</div>
				<div className="pb-1">
					<ConnectButton/>
				</div>
			</div>
		</header>
	</div>
	)
}

export default Header
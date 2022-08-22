import { useEffect, useState, useContext } from "react"
import { client, ownedBy, getProfile } from "../api"
import { UserContext } from "./UserContext"
import { ProfileContext } from "./ProfileContext"
import { InfoContext } from "./InfoContext"

function SelectProfile() {
	const [account, setAccount] = useState()
	const [ownedProfiles, setOwnedProfiles] = useState([])
	const [selected, setSelected] = useState(0)
	const [dropdown, setDropdown] = useState(false)
	const {user, setUser} = useContext(UserContext)
	const {profile, setProfile} = useContext(ProfileContext)
	const {info, setInfo} = useContext(InfoContext)

	useEffect(() => {
		connect()
		fetchOwnedProfiles()
		fetchProfile()
	})

	async function connect() {
		const [accounts] = await window.ethereum.request({
			method: "eth_requestAccounts"
		})
		setAccount(accounts)
	}

	async function fetchOwnedProfiles() {
		try {
			const response = await client.query(ownedBy, {"address": account}).toPromise()
			setOwnedProfiles(response.data.profiles.items)
		} catch (error) {
			console.log("error:", error)
		}
	}

	async function fetchProfile() {
		try {
			const response = await client.query(getProfile, {"id": profile.id}).toPromise()
			setInfo(response.data.profile)
			// console.log(response.data.profile.picture)
		} catch (error) {
			console.log("Error while fetching profile data:", error)
		}
	}

	function handleSelect(index) {
		setProfile(ownedProfiles[index])
		setSelected(index)
		setUser(ownedProfiles[index].handle)
	}

	function dropdownHandler()
	{
		setDropdown(!dropdown)
	}

	return (
		<div className="">
			<button onClick={dropdownHandler} id="dropdownDefault" data-dropdown-toggle="dropdown" className="text-white bg-black hover:bg-purple-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button">👤<svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
			{ dropdown ? (
			<div className="pt-2 absolute bg-black rounded-md">
				{ownedProfiles.map((profiles, index) => (
				<div>
					{
						<div className="pb-1">
						<button className="font-mono pl-2 pr-2 pb-2 pt-2 bg-black text-white w-30 border-none hover:text-purple-900" onClick={() => handleSelect(index)}>{profiles.handle}</button>
						</div>
					}
				</div>))
				}
			</div>) : (<div></div>)
			}
		</div>
	)
}

export default SelectProfile
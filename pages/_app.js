import "bootstrap/dist/css/bootstrap.min.css"
import "semantic-ui-css/semantic.min.css"
import "../styles/globals.css"
import { ApolloProvider } from "@apollo/client"
import { client } from "../api"
import { useState, useEffect } from "react"
import { UserContext } from "../components/UserContext"
import { ProfileContext } from "../components/ProfileContext"
import { InfoContext } from "../components/InfoContext"

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState()
	const [profile, setProfile] = useState()
	const [info, setInfo] = useState()

	return (
		<ProfileContext.Provider value={{profile, setProfile}}>
			<UserContext.Provider value={{user, setUser}}>
				<InfoContext.Provider value={{info, setInfo}}>
					<ApolloProvider client={client}>
						<Component {...pageProps} />
					</ApolloProvider>
				</InfoContext.Provider>
			</UserContext.Provider>
		</ProfileContext.Provider>
	)
}

export default MyApp

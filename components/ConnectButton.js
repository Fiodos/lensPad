import { useContext } from "react"
import { Button } from "semantic-ui-react"
import { UserContext } from "./UserContext"

function ConnectButton() {
	const {user} = useContext(UserContext)

	return (
		<div>
			<Button color={"violet"}>
				{user}
			</Button>
		</div>
	)
}

export default ConnectButton

import { useQuery } from "@apollo/client";
import recommendedProfilesQuery from "../queries/recommendedProfilesQuery.js";
import Profile from "../components/Profile.js";

export default function Profiles() {
	const {loading, error, data} = useQuery(recommendedProfilesQuery);

	if (loading) return 'Loading..';
	if (error) return `Error! ${error.message}`;

	return (
	<div>
		{data.recommendedProfilesQuery.map((profile, index) => {
		console.log(`Profile ${index}:`, profile);
		return <Profile key={profile.id} profile={profile} displayFullProfile={false} />;
		})}
	</div>
	)
}

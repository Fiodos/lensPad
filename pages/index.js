import Layout from "../components/Layout"
import Header from "../components/Header"
import Hero from "../components/Hero"
import Footer from "../components/Footer"
import "semantic-ui-css/semantic.min.css"

const Index = () => {
	return (
		<Layout pageTitle="Welcome to Lenspad">
			<Header />
			<Hero />
			<Footer/>
		</Layout>
	)
}
export default Index;


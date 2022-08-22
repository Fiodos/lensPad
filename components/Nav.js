import Link from "next/link"

function Nav() {
	return (
		<nav className="font-mono hover:cursor-pointer">
			<Link href={"/explore"} >
				<a className="px-16">Explore</a>
			</Link>
			<Link href={"/publish"} >
				<a className="px-16">Publish</a>
			</Link>
			<Link href={"/recommended"} >
				<a className="px-16">Profiles</a>
			</Link>
			<Link href={"/dashboard"}>
				<a className="px-16">Dashboard 👽</a>
			</Link>
		</nav>
	)
}

export default Nav
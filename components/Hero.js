import React from 'react';
import Image from 'next/image'
import apeImg from '../public/reading_ape.png'

const Hero = () => {
return (
	<section className=" bg-white mb-12">
		<div className="lg:flex">
			<div className="p-12 text-center">
				<h1 className="text-3xl font-bold font-mono">Empower Authors Globally</h1>
				<h3 className="font-mono">Decentralized NFT Books and Novels</h3>
			</div>
		</div>
		<div align="center" className="z-0">
			<Image
				src={apeImg}
				layout="fixed">
			</Image>
		</div>
	</section>
  )
}

export default Hero;
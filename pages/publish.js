import Router from "next/router"
import Moralis from "moralis"
import ABI from "../abi.json"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Footer from "../components/Footer"
import React, { useEffect, useState, useContext } from "react"
import { ethers } from "ethers"
import { Button } from "semantic-ui-react"
import { v4 as uuid } from "uuid"
import { address, serverUrl, appId, freeCollectModule, nullAddress } from "../constants"
import { create } from "ipfs-http-client"
import { ProfileContext } from "../components/ProfileContext"

function Publish() {
	let ipfsLink = ""
	const [clientIpfs, setClientIpfs] = useState()
	const [fileUrl, updateFileUrl] = useState(``)
	const [coverUrl, updateCoverUrl] = useState(``)
	const [selectedFile, setSelectedFile] = useState()
	const [account, setAccount] = useState()
	const {profile} = useContext(ProfileContext)

	Moralis.start({ serverUrl, appId })

	useEffect(() => {
		connect()
		getClient()
	}, [])

	useEffect(() => {
		if(window.ethereum) {
		  window.ethereum.on('accountsChanged', () => {
			window.location.reload();
		})
	}})

	async function getClient() {
		const auth = 'Basic ' + Buffer.from(process.env.INFURA_ID + ':' + process.env.INFURA_SECRET).toString('base64')

		const clientIpfs = await create({
			host: "ipfs.infura.io",
			port: 5001,
			protocol: "https",
			apiPath: "/api/v0",
			headers : {
				authorization: auth,
			},
		})
		setClientIpfs(clientIpfs)
	}

	async function connect() {
		const [accounts] = await window.ethereum.request({
			method: "eth_requestAccounts"
		})
		setAccount(accounts)
	}

	async function uploadMetaData(fileUrl) {
		const name = document.getElementById("metadataName").value
		const content = document.getElementById("metadataContent").value

		const metadata = {
			"version": "1.0.0",
			"metadata_id": uuid(),
			"description": fileUrl,
			"content": content,
			"name": name,
			"media" : [
				{
					"item": coverUrl,
					"type": "image/jpeg"
				}
			],
			"appId": "lenspad"
		}

		const str = btoa(unescape(encodeURIComponent(JSON.stringify(metadata))))
		const file = new Moralis.File("file.json", {base64 : str})
		await file.saveIPFS({useMasterKey:true})
		ipfsLink = file.ipfs()
	}

	async function onChange(e) {
		const file = e.target.files[0]
		setSelectedFile(file)
		console.log("set publication")
	}

	async function upload() {
		try {
		  const added = await clientIpfs.add(selectedFile)
		  const url = `https://lenspad.infura-ipfs.io/ipfs/${added.path}`
		  updateFileUrl(url)
		  return url
		} catch (error) {
		  console.log('Error uploading file: ', error)
		}
	}

	// this one uplaods the file automatically
	async function setCover(e) {
		const cover = e.target.files[0]
		try {
		  const added = await clientIpfs.add(cover)
		  const url = `https://lenspad.infura-ipfs.io/ipfs/${added.path}`
		  updateCoverUrl(url)
		  console.log("set cover", url)
		} catch (error) {
		  console.log('Error uploading cover: ', error)
		}
	  }

	function getSigner() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		return provider.getSigner();
	}

	async function publish() {
		const url = await upload()
		await uploadMetaData(url)
		const contentURI = ipfsLink
		const contract = new ethers.Contract(
			address,
			ABI,
			getSigner()
		)

		const collectModuleData = {
			amount: ethers.utils.parseEther("1"),
			currency: "0x0000000000000000000000000000000000001010",
			recipient: account,
			referralFee: 5,
			followerOnly: false
		}

		try {
			console.log("number:", ethers.utils.parseEther("0.05"))
			const postData = {
				profileId: profile.id,
				contentURI,
				collectModule: freeCollectModule,
				collectModuleInitData: ethers.utils.defaultAbiCoder.encode(['bool'], [true]),
				referenceModule: '0x0000000000000000000000000000000000000000',
				referenceModuleInitData: []
			}
			const tx = await contract.post(postData)
			await tx.wait()
			Router.reload(window.location.pathname)
		} catch (error){
			console.log("Error while publishing:", error)
		}
	}

	return (
		<Layout>
			<Header/>
		<div className="Publish">
			<div className="Upload">
				<h1 className="font-mono text-3xl pt-4 pl-2">Publish your work</h1>
				<form>
				<h3 className="font-mono text-lg pt-4 pl-2">Publication</h3>
				<div className="pl-2">
					<label class="block mb-2 text-sm font-sans text-gray-900 dark:text-gray-500" for="file_input">Upload your file</label>
					<input class="block w-60 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-900 dark:placeholder-gray-400" id="file_input" type="file" onChange={onChange}/>
				</div>
				<h3 className="font-mono text-lg pt-4 pl-2">Cover</h3>
				<div class="w-full pl-2">
					<label for="dropzone-file" class="flex flex-col justify-center items-center w-64 h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-purple-900">
						<div class="flex flex-col justify-center items-center pt-5 pb-6">
							<svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
						</div>
						<input id="dropzone-file" type="file" class="hidden" onChange={setCover}/>
					</label>
				</div>
				</form>
				{
					coverUrl && (
						<img src={coverUrl} width="200px" className="border-2 border-black pl-8 pt-4"/>
					)
				}
			</div>
				<div>
					<h3 className="font-mono text-lg pt-4 pl-2">Publications Name</h3>
					<div className="pl-2">
						<label for="name" className="block mb-2 text-sm font-mono text-gray-900 dark:text-gray-300"></label>
						<input type="text" name="metadataName" id="metadataName" className="bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey-900 dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-2" placeholder="Name" required/>
					</div>
					<div>
						<h3 className="font-mono text-lg pt-4 pl-2">Description / Summary</h3>
					<div className="pl-2">
						<label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"></label>
						<textarea name="metadataContent" id="metadataContent" rows="4" class="block p-2.5 w-80 h-80 text-m text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey-90 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description"></textarea>
					</div>
					<div className="pl-2 pt-4">
						<Button onClick={publish} color={"violet"}>Upload publication</Button>
					</div>
					</div>
				</div>
		</div>
		<Footer/>
		</Layout>
		)
}

export default Publish
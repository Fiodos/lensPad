// we need to create a client in order to receive API data from gql;
import { createClient } from 'urql'
import { gql } from '@apollo/client'

const APIURL = "https://api-mumbai.lens.dev"

// create the client using the URL;
export const client = createClient({
	url: APIURL
})

export const getProfile = `
query Profile (
	$id: ProfileId!
){
	profile(request: { profileId: $id }) {
	  id
	  name
	  bio
	  attributes {
		displayType
		traitType
		key
		value
	  }
	  followNftAddress
	  metadata
	  isDefault
	  picture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
		__typename
	  }
	  handle
	  coverPicture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
		__typename
	  }
	  ownedBy
	  dispatcher {
		address
		canUseRelay
	  }
	  stats {
		totalFollowers
		totalFollowing
		totalPosts
		totalComments
		totalMirrors
		totalPublications
		totalCollects
	  }
	  followModule {
		... on FeeFollowModuleSettings {
		  type
		  amount {
			asset {
			  symbol
			  name
			  decimals
			  address
			}
			value
		  }
		  recipient
		}
		... on ProfileFollowModuleSettings {
		  type
		}
		... on RevertFollowModuleSettings {
		  type
		}
	  }
	}
  }
`

export const getProfileByHandle = `
query Profile (
	$handle: Handle!
){
	profile(request: { handle: $handle }) {
	  id
	  name
	  bio
	  attributes {
		displayType
		traitType
		key
		value
	  }
	  followNftAddress
	  metadata
	  isDefault
	  picture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
		__typename
	  }
	  handle
	  coverPicture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
		__typename
	  }
	  ownedBy
	  dispatcher {
		address
		canUseRelay
	  }
	  stats {
		totalFollowers
		totalFollowing
		totalPosts
		totalComments
		totalMirrors
		totalPublications
		totalCollects
	  }
	  followModule {
		... on FeeFollowModuleSettings {
		  type
		  amount {
			asset {
			  symbol
			  name
			  decimals
			  address
			}
			value
		  }
		  recipient
		}
		... on ProfileFollowModuleSettings {
		  type
		}
		... on RevertFollowModuleSettings {
		  type
		}
	  }
	}
  }
`

export const getDefaultProfile = `
query DefaultProfile($address: EthereumAddress!) {
	defaultProfile(request: { ethereumAddress: $address}) {
	  id
	  name
	  bio
	  isDefault
	  attributes {
		displayType
		traitType
		key
		value
	  }
	  followNftAddress
	  metadata
	  handle
	  picture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  chainId
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
	  }
	  coverPicture {
		... on NftImage {
		  contractAddress
		  tokenId
		  uri
		  chainId
		  verified
		}
		... on MediaSet {
		  original {
			url
			mimeType
		  }
		}
	  }
	  ownedBy
	  dispatcher {
		address
		canUseRelay
	  }
	  stats {
		totalFollowers
		totalFollowing
		totalPosts
		totalComments
		totalMirrors
		totalPublications
		totalCollects
	  }
	  followModule {
		... on FeeFollowModuleSettings {
		  type
		  contractAddress
		  amount {
			asset {
			  name
			  symbol
			  decimals
			  address
			}
			value
		  }
		  recipient
		}
		... on ProfileFollowModuleSettings {
		 type
		}
		... on RevertFollowModuleSettings {
		 type
		}
	  }
	}
  }
`

export const searchProfiles = `
query Search ($search: Search!) {
	search(request: {
	  query: $search,
	  type: PROFILE,
	  limit: 10
	}) {
	  ... on ProfileSearchResult {
		__typename
		items {
		  ... on Profile {
			...ProfileFields
		  }
		}
		pageInfo {
		  prev
		  totalCount
		  next
		}
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment ProfileFields on Profile {
	profileId: id,
	name
	bio
	attributes {
	  displayType
	  traitType
	  key
	  value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }
`

export const searchPublication = `
query Search ($search: Search!){
	search(request: {
	  query: $search,
	  type: PUBLICATION,
	}) {
	  ... on PublicationSearchResult {
		 __typename
		items {
		  __typename
		  ... on Comment {
			...CommentFields
		  }
		  ... on Post {
			...PostFields
		  }
		}
		pageInfo {
		  prev
		  totalCount
		  next
		}
	  }
	  ... on ProfileSearchResult {
		__typename
		items {
		  ... on Profile {
			...ProfileFields
		  }
		}
		pageInfo {
		  prev
		  totalCount
		  next
		}
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
  }

  fragment ProfileFields on Profile {
	profileId: id,
	name
	bio
	attributes {
	   displayType
	   traitType
	   key
	   value
	}
	isFollowedByMe
	isFollowing(who: null)
	metadataUrl: metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	  ... on FreeCollectModuleSettings {
		  type
	  followerOnly
	  contractAddress
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
}`

export const getPublication = `
query Publication ($pubId: InternalPublicationId!) {
	publication(request: {
	  publicationId: $pubId
	}) {
	 __typename
	  ... on Post {
		...PostFields
	  }
	  ... on Comment {
		...CommentFields
	  }
	  ... on Mirror {
		...MirrorFields
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment ProfileFields on Profile {
	id
	name
	bio
	attributes {
	  displayType
	  traitType
	  key
	  value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	... on FreeCollectModuleSettings {
	  type
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
	...MirrorBaseFields
	mirrorOf {
	 ... on Post {
		...PostFields
	 }
	 ... on Comment {
		...CommentFields
	 }
	}
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
  }
`


export const recommendProfiles = `
query RecommendedProfiles {
	recommendedProfiles {
		  id
		name
		bio
		attributes {
		  displayType
		  traitType
		  key
		  value
		}
		  followNftAddress
		metadata
		isDefault
		picture {
		  ... on NftImage {
			contractAddress
			tokenId
			uri
			verified
		  }
		  ... on MediaSet {
			original {
			  url
			  mimeType
			}
		  }
		  __typename
		}
		handle
		coverPicture {
		  ... on NftImage {
			contractAddress
			tokenId
			uri
			verified
		  }
		  ... on MediaSet {
			original {
			  url
			  mimeType
			}
		  }
		  __typename
		}
		ownedBy
		dispatcher {
		  address
		  canUseRelay
		}
		stats {
		  totalFollowers
		  totalFollowing
		  totalPosts
		  totalComments
		  totalMirrors
		  totalPublications
		  totalCollects
		}
		followModule {
		  ... on FeeFollowModuleSettings {
			type
			amount {
			  asset {
				symbol
				name
				decimals
				address
			  }
			  value
			}
			recipient
		  }
		  ... on ProfileFollowModuleSettings {
		   type
		  }
		  ... on RevertFollowModuleSettings {
		   type
		  }
		}
	}
  }
`


export const getAllPublications = `
query ExplorePublications {
	explorePublications(request: {
	  sortCriteria: LATEST,
	  publicationTypes: [POST]
	}) {
	  items {
		__typename
		... on Post {
		  ...PostFields
		}
		... on Comment {
		  ...CommentFields
		}
		... on Mirror {
		  ...MirrorFields
		}
	  }
	  pageInfo {
		prev
		next
		totalCount
	  }
	}
  }

  fragment MediaFields on Media {
	url
	width
	height
	mimeType
  }

  fragment ProfileFields on Profile {
	id
	name
	bio
	attributes {
	  displayType
	  traitType
	  key
	  value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
		small {
		  ...MediaFields
		}
		medium {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
		small {
		 ...MediaFields
		}
		medium {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	  small {
		...MediaFields
	  }
	  medium {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	... on FreeCollectModuleSettings {
	  type
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
	...MirrorBaseFields
	mirrorOf {
	 ... on Post {
		...PostFields
	 }
	 ... on Comment {
		...CommentFields
	 }
	}
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
}`

export const getComments = `
query Publications ($comment: InternalPublicationId!) {
	publications(request: {
	  commentsOf: $comment
	}) {
	  items {
		__typename
		... on Post {
		  ...PostFields
		}
		... on Comment {
		  ...CommentFields
		}
		... on Mirror {
		  ...MirrorFields
		}
	  }
	  pageInfo {
		prev
		next
		totalCount
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment ProfileFields on Profile {
	id
	name
	bio
	attributes {
	   displayType
	   traitType
	   key
	   value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	... on FreeCollectModuleSettings {
		type
		followerOnly
		contractAddress
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
	...MirrorBaseFields
	mirrorOf {
	 ... on Post {
		...PostFields
	 }
	 ... on Comment {
		...CommentFields
	 }
	}
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
}`

export const getPublications = `
query Publications(
	$id: ProfileId
){
	publications(request: {
	  profileId: $id,
	  publicationTypes: [POST],
	  limit: 10
	}) {
	  items {
		__typename
		... on Post {
		  ...PostFields
		}
		... on Comment {
		  ...CommentFields
		}
		... on Mirror {
		  ...MirrorFields
		}
	  }
	  pageInfo {
		prev
		next
		totalCount
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment ProfileFields on Profile {
	id
	name
	bio
	attributes {
	   displayType
	   traitType
	   key
	   value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	... on FreeCollectModuleSettings {
		type
		followerOnly
		contractAddress
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
	...MirrorBaseFields
	mirrorOf {
	 ... on Post {
		...PostFields
	 }
	 ... on Comment {
		...CommentFields
	 }
	}
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
}`

export const getActivity = `
query Publications(
	$id: ProfileId
){
	publications(request: {
	  profileId: $id,
	  publicationTypes: [COMMENT, MIRROR],
	  limit: 10
	}) {
	  items {
		__typename
		... on Post {
		  ...PostFields
		}
		... on Comment {
		  ...CommentFields
		}
		... on Mirror {
		  ...MirrorFields
		}
	  }
	  pageInfo {
		prev
		next
		totalCount
	  }
	}
  }

  fragment MediaFields on Media {
	url
	mimeType
  }

  fragment ProfileFields on Profile {
	id
	name
	bio
	attributes {
	   displayType
	   traitType
	   key
	   value
	}
	isFollowedByMe
	isFollowing(who: null)
	followNftAddress
	metadata
	isDefault
	handle
	picture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	coverPicture {
	  ... on NftImage {
		contractAddress
		tokenId
		uri
		verified
	  }
	  ... on MediaSet {
		original {
		  ...MediaFields
		}
	  }
	}
	ownedBy
	dispatcher {
	  address
	}
	stats {
	  totalFollowers
	  totalFollowing
	  totalPosts
	  totalComments
	  totalMirrors
	  totalPublications
	  totalCollects
	}
	followModule {
	  ... on FeeFollowModuleSettings {
		type
		amount {
		  asset {
			name
			symbol
			decimals
			address
		  }
		  value
		}
		recipient
	  }
	  ... on ProfileFollowModuleSettings {
	   type
	  }
	  ... on RevertFollowModuleSettings {
	   type
	  }
	}
  }

  fragment PublicationStatsFields on PublicationStats {
	totalAmountOfMirrors
	totalAmountOfCollects
	totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
	name
	description
	content
	media {
	  original {
		...MediaFields
	  }
	}
	attributes {
	  displayType
	  traitType
	  value
	}
  }

  fragment Erc20Fields on Erc20 {
	name
	symbol
	decimals
	address
  }

  fragment CollectModuleFields on CollectModule {
	__typename
	... on FreeCollectModuleSettings {
		type
		followerOnly
		contractAddress
	}
	... on FeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	}
	... on LimitedTimedFeeCollectModuleSettings {
	  type
	  collectLimit
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
	... on RevertCollectModuleSettings {
	  type
	}
	... on TimedFeeCollectModuleSettings {
	  type
	  amount {
		asset {
		  ...Erc20Fields
		}
		value
	  }
	  recipient
	  referralFee
	  endTimestamp
	}
  }

  fragment PostFields on Post {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
	...MirrorBaseFields
	mirrorOf {
	 ... on Post {
		...PostFields
	 }
	 ... on Comment {
		...CommentFields
	 }
	}
  }

  fragment CommentBaseFields on Comment {
	id
	profile {
	  ...ProfileFields
	}
	stats {
	  ...PublicationStatsFields
	}
	metadata {
	  ...MetadataOutputFields
	}
	createdAt
	collectModule {
	  ...CollectModuleFields
	}
	referenceModule {
	  ... on FollowOnlyReferenceModuleSettings {
		type
	  }
	}
	appId
	hidden
	reaction(request: null)
	mirrors(by: null)
	hasCollectedByMe
  }

  fragment CommentFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		...MirrorBaseFields
		mirrorOf {
		  ... on Post {
			 ...PostFields
		  }
		  ... on Comment {
			 ...CommentMirrorOfFields
		  }
		}
	  }
	}
  }

  fragment CommentMirrorOfFields on Comment {
	...CommentBaseFields
	mainPost {
	  ... on Post {
		...PostFields
	  }
	  ... on Mirror {
		 ...MirrorBaseFields
	  }
	}
}`

  export const getOwnership = `
  query Nfts(
	$user: EthereumAddress!
	$nft: ContractAddress!
  ){
	nfts(request: {
	  ownerAddress: $user,
	  contractAddress: $nft,
	  limit: 10,
	  chainIds: [80001]
	}) {
	  items {
		contractName
		contractAddress
		symbol
		tokenId
		owners {
		  amount
		  address
		}
		name
		description
		contentURI
		originalContent {
		  uri
		  metaType
		}
		chainId
		collectionName
		ercType
	  }
	  pageInfo {
		prev
		next
		totalCount
	  }
	}
  }
`

export const ownedBy = `
query MyQuery ($address: [EthereumAddress!]){
	profiles(request: {ownedBy: $address}) {
	  items {
		handle
		id
	  }
	}
  }
`

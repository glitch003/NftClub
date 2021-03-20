const Web3 = require('web3')
const admin = require('firebase-admin')
const Bugsnag = require('@bugsnag/js')
const functions = require('firebase-functions')

Bugsnag.start({ apiKey: functions.config().bugsnag.apikey })
admin.initializeApp()

const db = admin.firestore()

const balanceOf = async ({ contractAddress, web3, abi, holderAddress }) => {
  console.log(`Getting balance for contract address ${contractAddress}`)
  const contract = new web3.eth.Contract(abi, contractAddress)
  try {
    return await contract.methods.balanceOf(holderAddress).call()
  } catch (error) {
    console.log(`getting balance for contract ${contractAddress} produced an exception: `)
    console.error(error)
    return 0
  }
}

exports.isHolder = async ({ contractAddressArray, holderAddress }) => {
  const provider = new Web3.providers.HttpProvider(
    functions.config().infura.url
  )
  const web3 = new Web3(provider)
  const abi = [{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: 'totalSupply', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'catNoLongerForSale', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'catIndexToAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'withdraw', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: '_totalSupply', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'releaseCatIndexUpperBound', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_releaseId', type: 'uint32' }, { name: 'catPrice', type: 'uint256' }], name: 'updateCatReleasePrice', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [], name: 'getContractOwner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'getCat', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: true, inputs: [], name: 'imageHash', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'getCatPrice', outputs: [{ name: 'catPrice', type: 'uint256' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'attributeType', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }, { name: 'minSalePriceInWei', type: 'uint256' }, { name: 'toAddress', type: 'address' }], name: 'offerCatForSaleToAddress', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'standard', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'totalSupplyIsLocked', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }, { name: 'attrIndex', type: 'uint256' }, { name: 'attrValue', type: 'string' }], name: 'setCatAttributeValue', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '_owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint32' }], name: 'catReleaseToPrice', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: '_releaseId', type: 'uint32' }, { name: 'numberOfCatsAdded', type: 'uint256' }, { name: 'catPrice', type: 'uint256' }, { name: 'newImageHash', type: 'string' }], name: 'releaseCats', outputs: [{ name: 'newTotalSupply', type: 'uint256' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'previousContractAddress', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'getCatRelease', outputs: [{ name: '', type: 'uint32' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'catsForSale', outputs: [{ name: 'isForSale', type: 'bool' }, { name: 'catIndex', type: 'uint256' }, { name: 'seller', type: 'address' }, { name: 'minPrice', type: 'uint256' }, { name: 'sellOnlyTo', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'allCatsAssigned', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'contractVersion', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'startIndex', type: 'uint256' }, { name: 'endIndex', type: 'uint256' }], name: 'migrateCatOwnersFromPreviousContract', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: 'attributeIndex', type: 'uint256' }, { name: 'descriptionText', type: 'string' }], name: 'setAttributeType', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'currentReleaseCeiling', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }, { name: 'catPrice', type: 'uint256' }], name: 'setCatPrice', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'getCatOwner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }], name: 'buyCat', outputs: [], payable: true, stateMutability: 'payable', type: 'function' }, { constant: false, inputs: [{ name: 'catIndex', type: 'uint256' }, { name: 'minSalePriceInWei', type: 'uint256' }], name: 'offerCatForSale', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }], name: 'catIndexToPriceException', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'catsRemainingToAssign', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'lockTotalSupply', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'address' }], name: 'pendingWithdrawals', outputs: [{ name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: '', type: 'uint256' }, { name: '', type: 'uint256' }], name: 'catAttributes', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { inputs: [], payable: true, stateMutability: 'payable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'catIndex', type: 'uint256' }], name: 'CatTransfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'catIndex', type: 'uint256' }, { indexed: false, name: 'minPrice', type: 'uint256' }, { indexed: true, name: 'toAddress', type: 'address' }], name: 'CatOffered', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'catIndex', type: 'uint256' }, { indexed: false, name: 'price', type: 'uint256' }, { indexed: true, name: 'fromAddress', type: 'address' }, { indexed: true, name: 'toAddress', type: 'address' }], name: 'CatBought', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'catIndex', type: 'uint256' }], name: 'CatNoLongerForSale', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'catIndex', type: 'uint256' }], name: 'Assign', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'newCatsAdded', type: 'uint256' }, { indexed: false, name: 'totalSupply', type: 'uint256' }, { indexed: false, name: 'catPrice', type: 'uint256' }, { indexed: false, name: 'newImageHash', type: 'string' }], name: 'ReleaseUpdate', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, name: 'releaseId', type: 'uint32' }, { indexed: false, name: 'catPrice', type: 'uint256' }], name: 'UpdateReleasePrice', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'attributeNumber', type: 'uint256' }, { indexed: true, name: 'ownerAddress', type: 'address' }, { indexed: false, name: 'oldValue', type: 'bytes32' }, { indexed: false, name: 'newValue', type: 'bytes32' }], name: 'UpdateAttribute', type: 'event' }]

  const promises = []
  for (let i = 0; i < contractAddressArray.length; i++) {
    promises.push(balanceOf({
      contractAddress: contractAddressArray[i],
      web3,
      abi,
      holderAddress
    }))
  }

  const balances = await Promise.all(promises)
  console.log('balances is ' + JSON.stringify(balances))
  return balances.some(b => b > 0)
}

exports.createLinkInDb = async (data) => {
  const res = await db.collection('links').add(data)
  return { id: res.id }
}

exports.findLinkInDb = async ({ linkId }) => {
  const res = await db.collection('links').doc(linkId).get()
  return res.data()
}

exports.bugsnagWrapper = (handler) => {
  return (data, context) => {
    try {
      return handler(data, context)
    } catch (e) {
      Bugsnag.notify(e)
      throw e
    }
  }
}

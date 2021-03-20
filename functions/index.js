const functions = require('firebase-functions')
const { recoverPersonalSignature } = require('eth-sig-util')
const { createLinkInDb, findLinkInDb, isHolder, bugsnagWrapper } = require('./utils')

const ERROR_MSG = 'Error: You are not a holder of this NFT'

exports.createLink = functions.https.onCall(bugsnagWrapper(async (data, context) => {
  const { contractAddressArray, sig, msg, linkDestination } = data
  // functions.logger.info(`createLink with sig ${sig} and message ${msg}`, { structuredData: true })
  functions.logger.info(`createLink with sig ${sig} and message ${msg}`)

  // verify the sig
  const holderAddress = recoverPersonalSignature({
    data: msg,
    sig: sig
  })
  functions.logger.info(`Recovered address ${holderAddress}`)

  // does this user have the NFT?
  try {
    const result = await isHolder({
      contractAddressArray,
      holderAddress
    })
    if (!result) {
      functions.logger.error(ERROR_MSG)
      return { error: ERROR_MSG }
    }
  } catch (error) {
    functions.logger.error(error)
    return { error: ERROR_MSG }
  }

  const { id } = await createLinkInDb({
    linkDestination,
    contractAddressArray
  })

  const link = `https://nftclub.in/l/${id}`

  return { success: true, link }
}))

exports.authNftHolder = functions.https.onCall(bugsnagWrapper(async (data, context) => {
  const { sig, msg, linkId } = data
  // functions.logger.info(`createLink with sig ${sig} and message ${msg}`, { structuredData: true })
  functions.logger.info(`authNftHolder with sig ${sig} and message ${msg} and linkId ${linkId}`)

  const { linkDestination, contractAddressArray } = await findLinkInDb({ linkId })

  // verify the sig
  const holderAddress = recoverPersonalSignature({
    data: msg,
    sig: sig
  })
  functions.logger.info(`Recovered address ${holderAddress}`)

  // does this user have the NFT?
  try {
    const result = await isHolder({
      contractAddressArray,
      holderAddress
    })
    if (!result) {
      functions.logger.error(ERROR_MSG)
      return { error: ERROR_MSG }
    }

    return { success: true, linkDestination }
  } catch (error) {
    functions.logger.error(error)
    return { error: ERROR_MSG }
  }
}))

import firebase from './firebase'

export async function createLink (data) {
  const createLinkOnFirebase = firebase.functions().httpsCallable('createLink')
  const result = await createLinkOnFirebase(data)
  console.log(result)
  return result.data
}

export async function authNftHolder (data) {
  const createLinkOnFirebase = firebase.functions().httpsCallable('authNftHolder')
  const result = await createLinkOnFirebase(data)
  console.log(result)
  return result.data
}

import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

import { signMessage } from './utils/eth'
import { authNftHolder } from './utils/cloudFunctions'

import { useRouteMatch } from 'react-router-dom'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    textAlign: 'center'
  },
  error: {
    color: 'red'
  }
}))

function App () {
  const classes = useStyles()
  const match = useRouteMatch()
  const { params } = match
  const { linkId } = params
  const [error, setError] = useState(null)
  const [signing, setSigning] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    authNftAndRedirect()
  }, [])

  const authNftAndRedirect = async () => {
    setError(null)
    setSigning(true)
    setRedirecting(false)
    const body = `I am proving that I own an NFT on ${new Date().toISOString()}`
    let sig = ''
    try {
      sig = await signMessage({ body })
    } catch (error) {
      setError(JSON.stringify(error))
      setSigning(false)
      return
    }

    try {
      const { error, linkDestination } = await authNftHolder({
        sig,
        msg: body,
        linkId
      })
      if (error) {
        setError(error)
        setSigning(false)
        return
      }
      setRedirecting(true)
      setSigning(false)
      const finalDestination = linkDestination.includes('http')
        ? linkDestination
        : 'http://' + linkDestination
      window.location = finalDestination
    } catch (error) {
      console.log('error', error)
      // Getting the Error details.
      // const code = error.code
      const message = error.message
      // const details = error.details
      setError(message)
    }
    setSigning(false)
  }

  return (
    <div className={classes.root}>
      {redirecting
        ? (
          <>
            <Typography variant='h5' gutterBottom>Success!  You are being redirected</Typography>
            <br />
            <br />
            <CircularProgress />
          </>
          )
        : null}
      {signing && !redirecting
        ? (
          <>
            <Typography variant='h5' gutterBottom>Please sign the message to visit this link</Typography>
          </>
          )
        : null}
      {!signing && !redirecting
        ? (
          <>
            <Typography variant='h5' gutterBottom>Please sign the message to visit this link</Typography>
            <br />
            <Button variant='contained' onClick={authNftAndRedirect}>Sign Message</Button>
          </>
          )
        : null}
      <br />
      <br />
      <div className={classes.error}>{error}</div>
    </div>
  )
}

export default App

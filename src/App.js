import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import CloseIcon from '@material-ui/icons/Close'
import isURL from 'validator/es/lib/isURL'

import { signMessage } from './utils/eth'
import { createLink } from './utils/cloudFunctions'

const filter = createFilterOptions()

const NFTs = [
  {
    name: 'Cryptocats (all versions)',
    address: ['0x9508008227b6b3391959334604677d60169EF540', '0x19c320b43744254ebdBcb1F1BD0e2a3dc08E01dc', '0x088C6Ad962812b5Aa905BA6F3c5c145f9D4C079f', '0xd0e7bc3f1efc5f098534bce73589835b8273b9a0']
  },
  {
    name: 'Original Cryptocats - 0x95',
    address: ['0x9508008227b6b3391959334604677d60169EF540']
  },
  {
    name: 'Cryptocats V3 - 0x19c',
    address: ['0x19c320b43744254ebdBcb1F1BD0e2a3dc08E01dc']
  },
  {
    name: 'Official Cryptocats - 0x08',
    address: ['0x088C6Ad962812b5Aa905BA6F3c5c145f9D4C079f']
  },
  {
    name: 'Wrapped Cryptocats Official',
    address: ['0xd0e7bc3f1efc5f098534bce73589835b8273b9a0']
  },
  {
    name: 'Hashmasks',
    address: ['0xc2c747e0f7004f9e8817db2ca4997657a7746928']
  },
  {
    name: 'Wrapped Mooncats',
    address: ['0x7c40c393dc0f283f318791d746d894ddd3693572']
  },
  {
    name: 'CryptoKitties',
    address: ['0x06012c8cf97bead5deae237070f9587f8e7a266d']
  },
  {
    name: 'CryptoPunks',
    address: ['0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb']
  },
  {
    name: 'ROPE',
    address: ['0xdb68df0e86bc7c6176e6a2255a5365f51113bce8']
  },
  {
    name: 'Ethereum Name Service',
    address: ['0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85']
  },
  {
    name: 'Unstoppable Domains Animals',
    address: ['0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe']
  },
  {
    name: 'Unstoppable Domains',
    address: ['0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe']
  },
  {
    name: 'Axie Infinity',
    address: ['0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d']
  },
  {
    name: 'BASTARD GAN PUNKS V2',
    address: ['0x31385d3520bced94f77aae104b406994d8f2168c']
  },
  {
    name: 'Urbit IDs',
    address: ['0x6ac07b7c4601b5ce11de8dfe6335b871c7c4dd4d']
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    textAlign: 'center'
  },
  sameWidth: {
    maxWidth: 465,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  error: {
    color: 'red'
  },
  linkInput: {
    width: '100%'
  }
}))

function App () {
  const classes = useStyles()
  const [selectedContract, setSelectedContract] = useState('')
  const [selectedUrl, setSelectedUrl] = useState('')
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleCreateLink = async () => {
    setError('')
    setLink('')
    if (!selectedContract || !selectedUrl) {
      return
    }
    if (!isURL(selectedUrl)) {
      setError('URL is invalid')
      return
    }

    const body = `I am proving that I own an NFT on ${new Date().toISOString()}`
    const sig = await signMessage({ body })
    try {
      const { error, link } = await createLink({
        sig,
        msg: body,
        contractAddressArray: selectedContract.address,
        linkDestination: selectedUrl
      })
      if (error) {
        setError(error)
        return
      }
      setLink(link)
    } catch (error) {
      console.log('error', error)
      // Getting the Error details.
      // const code = error.code
      const message = error.message
      // const details = error.details
      setError(message)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <div className={classes.root}>
      <header>
        <br />
        <Typography variant='h1' gutterBottom>
          NFT Club
        </Typography>
        <Typography variant='h5' gutterBottom>
          Create links that only NFT holders can view
        </Typography>
        <br />
        <br />
      </header>
      <div>

        <Autocomplete
          className={classes.sameWidth}
          options={NFTs}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText="You can also enter a contract address if you don't see the NFT you want" label='Choose your NFT' variant='outlined'
            />
          )}
          value={selectedContract}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setSelectedContract({
                name: newValue,
                address: [newValue]
              })
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setSelectedContract({
                name: newValue.inputValue,
                address: [newValue.inputValue]
              })
            } else {
              setSelectedContract(newValue)
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)

            // Suggest the creation of a new value
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`
              })
            }

            return filtered
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue
            }
            // Regular option
            return option.name
          }}
          renderOption={(option) => option.name}
          freeSolo
        />
        <br />
        <br />
        <TextField
          variant='outlined'
          label='What URL should the link redirect to?'
          helperText='Only holders of the NFT will be able to view this link'
          className={classes.sameWidth}
          value={selectedUrl}
          onChange={e => setSelectedUrl(e.target.value)}
          placeholder='https://google.com'
        />
        <br />
        <br />
        <br />
        <Button
          variant='contained'
          className={classes.sameWidth}
          onClick={handleCreateLink}
        >
          Create Link
        </Button>
        <br />
        <div style={{ height: 8 }} />
        <Typography variant='caption'>Only holders of the NFT can create links for it</Typography>
        <br />
        <br />
        <Typography className={classes.error} variant='body1'>{error}</Typography>

        <br />
        <br />
        {link
          ? (
            <>
              <Grid
                container
                direction='row'
                spacing={2}
                className={classes.sameWidth}
                alignItems='center'
                justify='center'
              >
                <Grid item>
                  <Typography variant='h6'>
                    Your link is
                  </Typography>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <TextField
                    variant='outlined'
                    value={link}
                    className={classes.linkInput}
                    readOnly
                  />
                </Grid>
                <Grid item>
                  <CopyToClipboard
                    text={link}
                    onCopy={() => setSnackbarOpen(true)}
                  >
                    <IconButton><FileCopyOutlinedIcon /></IconButton>
                  </CopyToClipboard>
                </Grid>
              </Grid>
            </>
            )
          : null}
        <br />
        <br />
        <br />
        <Typography variant='subtitle1'>
          Need help?  Want us to add your favorite NFT?{'  '}
          <Link variant='subtitle1' href='mailto:support@nftclub.in'>
            Email us at support@nftclub.in
          </Link>
        </Typography>
        <br />
        <br />
        <Typography variant='subtitle1'>NFT Club is now open source:{' '}
          <Link variant='subtitle1' href='https://github.com/glitch003/NftClub'>
            https://github.com/glitch003/NftClub
          </Link>
        </Typography>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          className={classes.snackbar}
          message='Copied'
          action={
            <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseSnackbar}>
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        />
      </Snackbar>
    </div>
  )
}

export default App

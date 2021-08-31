# NFTClub

This project lets you create links that only NFT holders can view.  Email support@nftclub.in with any questions.  Also I literally wrote this entire project on a Friday night after my gf fell asleep, so it probably sucks in various ways.  Pull requests welcome!

## Deployment

The whole project runs on Firebase, so to deploy you would first create a Firebase project.

There are 2 deployment scripts: 1 for frontend and 1 for backend.  Frontend is deploy.sh in the root folder and backend is deploy.sh in the functions folder.

You'll need to set 2 env vars on firebase with the following command.  Please use your own bugsnag.com key for a nodejs project and an infura eth http rpc URL.

```
firebase functions:config:set bugsnag.apikey="put_a_bugsnag+apikey_here" infura.url="put_your_infura_url_here"
```

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
Note that you need the firebase functions to be deployed for this to work.

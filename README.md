# ETHDenver Hackathon Demo dApp

### The dApp
Show off your linguistic chops with a fridge magnet style interface, and remix the work of other "poets". ... And all using the familiar crypto mnemonic word list.

### The tech:
This dApp focuses on usability features - no browser extensions, no gas confirmations.

### Get Started with the vue single-page app:
```
  $: npm install
  $: npm run dev
```

### Other implementation pieces:
True to the theme of frictionless use, auth services are managed through Google OAuth provider, w/ goals of adding more providers, and using decentralized Multifactor solutions.

The Google API key are imported in:  
`./index.html`  
`./config/dev.env.js`

The frictionless Key / Transaction Signing service are managed in a secured server, that uses the identity provider's JWT workflow.  
These are run in serverless fashion in AWS Lambda.  
The workflow to update and deploy a Lambda service is to zip the source and dependencies, then upload to AWS Lambda or deploy via CLI.
Src is found in `./lambda/`
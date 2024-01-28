# The official wikiric SDK

---

## Features

This SDK provides easy access to the chat functionality.

- Easy login
- Easy chat session creation
- Automatic chat session authorization
- Decryption of incoming E2E encrypted messages
- Sending of messages

## Dependencies

The only requirement to be able to use this SDK is the `wikiricrypt` library
that is being developed for wikiric, too. The library needs to be in
the same folder as the wikiric SDK.

## Private Key

To get the private key which is needed to connect to a chat group
you need to open the targeted chat group, click on your profile and then on "Transfer".
On the bottom side of the modal you will see the button to copy the private Key.

## Code

Quick Start Copy&Paste Template:

```js
// 0. Initialize SDK
const wikiric = wikiricSDK

// 1. Authorize
await wikiric.login('yourUsername', 'yourPassword')

// 2. Connect to the chat group (or channel if provided)
wikiric.connect('yourChatID', 'yourPrivateKey', 'yourOptionalChannelID')

// 3. Listen to the chat group's incoming messages
const events = new BroadcastChannel('wikiricsdk')
events.onmessage = event => { console.log('New Message', event.data) }

// 4. Send a message to the chat group
wikiric.sendMessage('Hello World!')
```
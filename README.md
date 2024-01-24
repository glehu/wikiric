# wikiric

This repository contains the front end for the wikiric collaboration platform.

In the /libs folder you will find an SDK for easy access to the wikiric chats.

# The official wikiric SDK

## Features

This SDK provides easy access to the chat functionality.

- Easy login
- Easy chat session creation
- Automatic chat session authorization
- Decryption of incoming E2E encrypted messages
- Sending of messages

## Private Key

To get the private key which is needed to connect to a chat group
you need to open the targeted chat group, click on your profile and then on "Transfer".
On the bottom side of the modal you will see the button to copy the private Key.

## Code

Quick Start Copy&Paste Template:

```js
// 1. Get token
await this.sdk.login('changeThisUsername', 'changeThisPassword')
// 2. Connect to chat group
this.sdk.connect('changeThisChatGroupUUID', 'changeThisPrivateKey')
// 3. Listen to incoming messages
const events = new BroadcastChannel('wikiricsdk')
events.onmessage = event => {
  console.log('SDK', event.data)
}
```

# Solidity DKIM

A Solidity library to efficiently verify [DKIM signatures](https://tools.ietf.org/html/rfc6376):

- Supports `rsa-sha1` and `rsa-sha256` signature algorithms
- Implements both canonicalization algorithms (`simple`, `relaxed`)
- Gas costs less than 100 thousand
- Includes email parser library & demo website
- Tested on Gmail, iCloud, Outlook, Protonmail and Yahoo

## How it works

The goal is to verify DKIM signatures using solidity in a secure, private and economical way.

We achieve that by parsing the raw email off-chain in the user's client, and then running the verification on-chain.
This ensures that the email gets securely verified while keeping gas costs low.

The project consists of:

1. `DKIM.sol` to verify signatures
2. `parse-email` to parse emails (supports node & browser environments)
3. `Service.sol` to demonstrate usage with Oracle
4. `solidity-dkim demo` demo website

## Try it out

1. download a sample [email](/test/emails)
2. (optional) download your own email ![download](/download.png)
3. visit [demo app](https://dkim-oracle-demo-gold-psi.now.sh/)
4. make sure metamask is on the rinkeby network
5. upload email
6. verify 🎉

## Getting Started

### Setup

```
$ git clone https://github.com/nionis/solidity-dkim
$ cd solidity-dkim
$ npm install
```

### Setup Demo

```
$ cd client
$ npm install
```

## Run project

```
$ npm run dev
$ migrate

$ cd client
$ npm run dev
```

## Contributions to open-sourced projects

- [node-dkim](https://github.com/jhermsmeier/node-dkim) is used by `parse-email`, we helped improve `node-dkim` by fixing a [header canonicalization bug](https://github.com/jhermsmeier/node-dkim/pull/13)

## 3rd party smart contracts

- [https://github.com/ensdomains/buffer](https://github.com/ensdomains/buffer)
- [https://github.com/jhermsmeier/node-dkim](https://github.com/jhermsmeier/node-dkim)

## Inspired by

- [https://github.com/ensdomains/dnssec-oracle](https://github.com/ensdomains/dnssec-oracle)

## Pitfalls

- **no header boundary found**: this is usually due to a raw email format being incorrect. Make sure you "download" the raw email like shown [here](https://github.com/nionis/solidity-dkim#try-it-out), since copy / pasting to a text file may replace CRLF characters with LF, [learn more](https://tools.ietf.org/html/rfc6376#section-3.4)

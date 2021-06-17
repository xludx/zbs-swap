# Boilerplate for ethereum solidity smart contract development

## TODO
- run a script against a specific network
- move gui to root

## INSTALL

```bash
yarn install
```

## BUILD & TEST & DEV

```bash
yarn build
yarn test
yarn dev
```

## SCRIPTS

```bash
yarn prepare                  - generate config file and typechain to get started with type safe contract interactions
yarn lint                     - lint ts and sol code, run prettier
yarn compile                  - compile contracts
yarn void:deploy              - deploy to in-memory hardhat network and exit to deployments work as intended
yarn test [mocha args...]     - execute tests with mocha
yarn coverage                 - produce a coverage report
yarn gas                      - produce a gas report for function used in the tests

yarn dev                          - run a local hardhat network on `localhost:8545` and deploy your contracts on it, watch for changes and redeploy
yarn dev:local                    - assumes a local node and deploy contracts on it, watch for changes and redeploy
yarn deploy <net> [args]          - deploy the contract on the specified <net>work
yarn export <net> <f.json>        - export the abi+address of deployed contract to `<file.json>`
yarn execute <net> <f.ts> [args]  - execute the script `<f.ts>` against the specified <net>work
```

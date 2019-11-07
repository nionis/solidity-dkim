import { types, flow } from "mobx-state-tree";
import getEth from "./getEth";
import { getContract } from "./getContract";
import { isSSR } from "../../utils";

const Model = types
  .model("Eth", {
    isInstalled: types.maybeNull(types.boolean),
    account: types.maybeNull(types.string),
    networkId: types.maybeNull(types.number)
  })
  .views(self => ({
    get isLoggedIn() {
      return self.account !== null;
    },
    get network() {
      if (self.networkId === 1) {
        return "mainnet";
      } else if (self.networkId === 2) {
        return "morden";
      } else if (self.networkId === 3) {
        return "ropsten";
      } else if (self.networkId === 4) {
        return "rinkeby";
      } else if (self.networkId === 5) {
        return "goerli";
      } else if (self.networkId === 42) {
        return "kovan";
      } else if (self.networkId === 1337) {
        return "geth private";
      }

      return "unknown network";
    }
  }))
  .actions(self => {
    let eth: any | undefined;

    return {
      _getEth() {
        return eth;
      },
      getEth() {
        if (!eth) {
          throw Error("eth not initialized");
        }

        return eth;
      },
      setEth(_eth: any) {
        eth = _eth;
      }
    };
  })
  .actions(self => ({
    sync: flow(function*() {
      if (isSSR) {
        return;
      }

      // not found, check window
      if (!self._getEth()) {
        self.setEth(yield getEth());
      }

      const eth = self._getEth();

      // not found
      if (typeof eth === "undefined") {
        self.isInstalled = false;
        return;
      }

      self.isInstalled = true;
      self.setEth(eth);

      const accounts = (yield eth.accounts()) || [];
      self.account = accounts[0] || null;

      const networkId = Number(eth.currentProvider.networkVersion);
      self.networkId = networkId;
    }),

    getContract(name: Parameters<typeof getContract>["1"]) {
      const eth = self.getEth();

      return getContract(eth, name);
    }
  }));

export default Model;

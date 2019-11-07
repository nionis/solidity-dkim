import Eth from "ethjs";

const check = () => {
  const { web3 } = window as typeof window & { web3: any };

  const foundInWindow = typeof web3 !== "undefined";
  if (!foundInWindow) {
    console.log(`No web3 instance injected.`);
    return undefined;
  }

  console.log(`Injected web3 detected.`);
  return new Eth(web3.currentProvider);
};

const getEth = () => {
  return new Promise<any | undefined>(resolve => {
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === "complete") {
      return resolve(check());
    }

    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolve(check());
    });
  });
};

export default getEth;

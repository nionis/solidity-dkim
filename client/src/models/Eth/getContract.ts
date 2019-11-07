const definitions = {
  DKIM: null
};

const getContract = async (eth: any, name: keyof typeof definitions) => {
  if (!definitions[name]) {
    const data = await import(`../../contracts/${name}.json`);

    definitions[name] = data;
  }

  const networkId = Number(eth.currentProvider.networkVersion);
  const networkData = definitions[name].networks[networkId];

  if (!networkData) {
    throw Error("contract address not found");
  }

  const contract = new eth.contract(definitions[name].abi);

  return contract.at(networkData.address);
};

export { getContract };

import Eth from "../models/Eth";

const eth = Eth.create();

eth.sync();
setInterval(() => eth.sync(), 1e3);

export default eth;

import { observer } from "mobx-react";
import ethStore from "../stores/eth";

const GetText = ({
  isInstalled,
  isLoggedIn,
  account,
  network
}: typeof ethStore) => {
  if (!isInstalled) {
    return (
      <a
        href="https://metamask.io/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#387fc7", textDecoration: "none" }}
      >
        INSTALL METAMASK
      </a>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {account ? (
        <div style={{ paddingRight: "1vh" }}>{`[${account}]`}</div>
      ) : null}

      <div>{network}</div>
    </div>
  );
};

const Metamask = observer(() => {
  const { isLoggedIn } = ethStore;

  return (
    <div className="metamaskStatus">
      <img
        src="/static/images/metamask.png"
        alt="Metamask Logo"
        className="img"
      />
      {GetText(ethStore)}

      <style jsx>{`
        .img {
          width: 4vh;
          height: 4vh;
          padding-right: 1vh;
        }
        .metamaskStatus {
          background-color: #fafafa;
          border: 1px solid ${isLoggedIn ? "#56A2BA" : "#387fc7"};
          color: ${isLoggedIn ? "#56A2BA" : "#387fc7"};
          border-radius: 3px;
          padding-left: 2vh;
          padding-right: 2vh;
          font-size: calc(12px + 0.4vw);
          height: 4.5vh;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
        }
      `}</style>
    </div>
  );
});

export default Metamask;

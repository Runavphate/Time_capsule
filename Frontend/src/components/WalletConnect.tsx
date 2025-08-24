import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function WalletConnect() {
  const { connect, disconnect, account, connected } = useWallet();

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected: {account ? String(account.address) : "No account"}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect("Petra")}>Connect Wallet</button>
      )}
    </div>
  );
}

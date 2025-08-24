import { useState } from "react";

export default function App() {
  const [address, setAddress] = useState(null);
  const [msg, setMsg] = useState("");
  const [onChainMsg, setOnChainMsg] = useState("");

  const MODULE_ADDR = "0x6b175b96ec8b802aafbd1207774bcc34341b1c0bddfbc6a1e9ef1fb5118be57a";

  const SET_FN = `${MODULE_ADDR}::capsule::set_message`;
  const GET_FN = `${MODULE_ADDR}::capsule::get_message`;

  async function connectPetra() {
    if (!window.aptos) {
      alert("Petra wallet not found. Install it first.");
      return;
    }
    try {
      const account = await window.aptos.connect();
      setAddress(account.address);
      console.log("Connected:", account);
    } catch (err) {
      console.error("Connect error:", err);
    }
  }

  // Send a transaction to set message
  async function sendMessage() {
    if (!address) return alert("Connect Petra first!");

    const payload = {
      type: "entry_function_payload",
      function: SET_FN,
      type_arguments: [],
      arguments: [msg],
    };

    try {
      const tx = await window.aptos.signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", tx.hash);

      const res = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${tx.hash}`
      );
      const data = await res.json();
      console.log("Transaction result:", data);
      alert("Message stored on-chain!");
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  }

  // Read message from chain
  async function readMessage() {
    if (!address) return;

    try {
      const res = await fetch("https://fullnode.testnet.aptoslabs.com/v1/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function: GET_FN,
          type_arguments: [],
          arguments: [address],
        }),
      });
      const data = await res.json();
      console.log("View response:", data);
      setOnChainMsg(data[0] ?? "");
    } catch (err) {
      console.error("Read failed:", err);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Aptos × Petra (no adapter)</h2>

      {!address ? (
        <button onClick={connectPetra}>Connect Petra</button>
      ) : (
        <p>Connected: {address}</p>
      )}

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ padding: 8, width: "100%" }}
        />
        <button onClick={sendMessage} disabled={!msg || !address} style={{ marginTop: 10 }}>
          Save Message
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={readMessage} disabled={!address}>
          Read On-Chain Message
        </button>
        {onChainMsg && <p>Stored Message: {onChainMsg}</p>}
      </div>
    </div>
  );
}

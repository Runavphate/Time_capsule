import { useState } from "react";
import './CreateCapsule.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function CreateCapsule() {
  const [recipient, setRecipient] = useState("");
  const [unlockTime, setUnlockTime] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

async function handleSubmit() {
  try {
    const res = await axios.post("http://localhost:4000/create_capsule", {
      sender: "0x6b175b96ec8b802aafbd1207774bcc34341b1c0bddfbc6a1e9ef1fb5118be57a",
      recipient,
      unlockTime,
      message,
      amount,
    });
    console.log("Capsule created:", res.data);
    navigate("/dashboard"); 
  } catch (err) {
    console.error("Error creating capsule:", err);
  }
}


  return (
    <div>
      <h2>Create Capsule</h2>
      <input placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input placeholder="Unlock Time (secs)" value={unlockTime} onChange={(e) => setUnlockTime(e.target.value)} />
      <input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input placeholder="Amount (Octas)" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="button" onClick={handleSubmit}>Create</button>
    </div>
  );
}

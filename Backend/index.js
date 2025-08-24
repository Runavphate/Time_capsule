import express from "express";
import cors from "cors";
import { Aptos, AptosConfig, Network } from "aptos";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const MODULE_ADDRESS = process.env.MODULE_ADDRESS; // e.g. "0xabc123..."

app.post("/create_capsule", async (req, res) => {
  try {
    const { sender, recipient, unlockTime, message, amount } = req.body;

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::time_capsule::create_capsule`,
      type_arguments: [],
      arguments: [
        recipient,
        unlockTime.toString(),
        Array.from(new TextEncoder().encode(message)),
        amount.toString(),
      ],
    };

    // Here, you'd normally sign with wallet or keypair (BE CAREFUL in prod)
    res.json({ payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/peek_capsule/:owner/:id", async (req, res) => {
  const { owner, id } = req.params;
  const payload = {
    function: `${MODULE_ADDRESS}::time_capsule::peek_capsule`,
    type_arguments: [],
    arguments: [owner, id.toString()],
  };
  const data = await aptos.view({ payload });
  res.json({ data });
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));

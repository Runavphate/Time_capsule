import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import CapsuleCard from "../components/CapsuleCard";
import { fetchCapsulesForOwner } from "../services/capsuleServices";
import './CreateCapsule.tsx';

type Capsule = {
  id: number;
  creator: string;
  recipient: string;
  unlockTime: number;
  opened: boolean;
  amount: number;
};

export default function Dashboard() {
  const { account } = useWallet();
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    if (!account) return;
    async function loadCapsules() {
      if (!account) return;
      const data = await fetchCapsulesForOwner(account.address.toString());
      const capsulesData: Capsule[] = Array.isArray(data)
        ? data.filter(
            (item): item is Capsule =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              "creator" in item &&
              "recipient" in item &&
              "unlockTime" in item &&
              "opened" in item &&
              "amount" in item &&
              typeof (item as any).id === "number" &&
              typeof (item as any).creator === "string" &&
              typeof (item as any).recipient === "string" &&
              typeof (item as any).unlockTime === "number" &&
              typeof (item as any).opened === "boolean" &&
              typeof (item as any).amount === "number"
          )
        : [];
      setCapsules(capsulesData);
    }
    loadCapsules();
  }, [account]);

  return (
    <div>
      <h2>Your Capsules</h2>
      {capsules.length === 0 ? (
        <p>No capsules found.</p>
      ) : account ? (
        capsules.map((cap, idx) => (
          <CapsuleCard key={idx} capsule={cap} owner={account.address.toString()} />
        ))
      ) : (
        <p>Wallet not connected.</p>
      )}
    </div>
  );
}


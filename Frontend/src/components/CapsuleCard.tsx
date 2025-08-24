import { Link } from "react-router-dom";

type Capsule = {
  id: number;
  creator: string;
  recipient: string;
  unlockTime: number;
  opened: boolean;
  amount: number;
};

interface CapsuleCardProps {
  capsule: Capsule;
  owner: string;
}

export default function CapsuleCard({ capsule, owner }: CapsuleCardProps) {
  const { creator, recipient, unlockTime, opened, amount, id } = capsule;

  return (
    <div className="card">
      <p><strong>ID:</strong> Capsule #{capsule.id}</p>
      <p><strong>Creator:</strong> {creator}</p>
      <p><strong>Recipient:</strong> {recipient}</p>
      <p><strong>Unlock Time:</strong> {new Date(unlockTime * 1000).toLocaleString()}</p>
      <p><strong>Status:</strong> {opened ? "✅ Opened" : "🔒 Locked"}</p>
      <p><strong>Funds:</strong> {amount} Octas</p>
      <Link to={`/capsule/${owner}/${capsule.id}`}>View Capsule</Link>
    </div>
  );
}

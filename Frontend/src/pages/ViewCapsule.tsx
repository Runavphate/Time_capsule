import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './ViewCapsule.css';
import '../components/CapsuleCard';
import axios from "axios";

export default function ViewCapsule() {
  const { owner, id } = useParams();
  const [capsule, setCapsule] = useState<any>(null);

  useEffect(() => {
    async function fetchCapsule() {
      const res = await axios.get(`http://localhost:4000/peek_capsule/${owner}/${id}`);
      const data = res.data as { data: any };
      setCapsule(data.data);
    }
    fetchCapsule();
  }, [owner, id]);

  return (
    <div>
      <h2>Capsule #{id}</h2>
      {capsule ? (
        <div>
          <p>Creator: {capsule[0]}</p>
          <p>Recipient: {capsule[1]}</p>
          <p>Unlock Time: {capsule[2]}</p>
          <p>Opened: {capsule[3] ? "Yes" : "No"}</p>
          <p>Funds: {capsule[4]} Octas</p>
        </div>
      ) : (
        <p>Loading capsule...</p>
      )}
    </div>
  );
}


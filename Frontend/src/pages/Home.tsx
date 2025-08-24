import  { Link }  from "react-router-dom";


export default function Home() {
  return (
    <div>
      <h1>Welcome to Time Capsule</h1>
      <button><Link to="/create">Create a Capsule</Link></button>
    </div>
  );
}   


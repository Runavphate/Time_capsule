import { AptosClient, Network } from "aptos";

const aptos = new AptosClient(Network.TESTNET);
const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS;

export async function fetchCapsulesForOwner(owner: string) {
  const capsuleIds = [1, 2, 3];

  const results = await Promise.all(
    capsuleIds.map(async (id) => {
      const viewRequest = {
        function: `${MODULE_ADDRESS}::time_capsule::peek_capsule`,
        type_arguments: [],
        arguments: [owner, id.toString()],
      };
      const res = await aptos.view(viewRequest);
      return typeof res[0] === "object" && res[0] !== null
        ? { ...res[0], id }
        : { value: res[0], id };
    })
  );

  return results;
}

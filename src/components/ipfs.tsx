import { useState, useEffect } from "react";
import { create } from "ipfs-core";
// import { create } from 'ipfs-http-client'

const IpfsComponent = () => {
  const [id, setId] = useState(null);
  const [ipfs, setIpfs] = useState(null);
  const [version, setVersion] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const addFile = async (client) => {
    const file = { path: "testFile", content: Buffer.from("i am the test") };
    const fileAdded = await client.add(file);
    console.log(fileAdded.cid.toString());
  };

  const getFile = async (filePath, node) => {
    node.cat(filePath);
  };

  useEffect(() => {
    const init = async () => {
      if (ipfs) return;

      const node = await create();

      const nodeId = await node.id();
      const nodeVersion = await node.version();
      const nodeIsOnline = node.isOnline();

      setIpfs(node);
      setId(nodeId.id);
      setVersion(nodeVersion.version);
      setIsOnline(nodeIsOnline);

      addFile(node);

      getFile("QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A", node);
      // 'https://ipfs.io/ipfs/QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A'
    };

    init();
  }, [ipfs]);

  if (!ipfs || !id) {
    return <h4>Connecting to IPFS...</h4>;
  }

  return (
    <div>
      <h4 data-test="id">ID: {id.toString()}</h4>
      <h4 data-test="version">Version: {version}</h4>
      <h4 data-test="status">Status: {isOnline ? "Online" : "Offline"}</h4>
    </div>
  );
};

export default IpfsComponent;

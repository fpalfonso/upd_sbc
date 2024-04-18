"use client";
import { useState } from "react";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { UpdSbc, IDL } from "./types/upd_sbc";

export default function Home() {
  const [connectedWallet, setconnectedWallet] = useState<null | string>(null);
  const [posts, setposts] = useState<any[]>([]);
  const [content, setcontent] = useState<string>("");
  const getProvider = () => {
    const {
      phantom: { solana },
    } = window as any;
    return solana;
  }; // tool for signing transactions, signers 

  const handleChange = (e: any) => {
    const { value } = e.target;
    setcontent(value);
  };

  function getContract(provider: AnchorProvider) {
    return new Program<UpdSbc>(
      IDL,
      new web3.PublicKey("GCGcqanABcRwwfVXyma59p8H1mX7KPNLwodbdG9Ee1g7"),
      provider
    );
  }

  const getAnchorProvider = () => {
    const provider = getProvider();
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    return new AnchorProvider(connection, provider, {});
  };
  
  
  const onGetPosts = async () => {
    const anchorProvider = getAnchorProvider();
    const anoniContract = getContract(anchorProvider);
    try {
      const temp = await anoniContract.account.message.all()
      temp.sort(function(a,b){
        return b.account.timestamp.toNumber() - a.account.timestamp.toNumber();
      })
      setposts(temp);
    } catch (e) {
      alert(e);
    }
  };

  const onConnectWallet = async () => {
    const provider = getProvider();

    try {
      const resp = await provider.connect();
      setconnectedWallet(resp.publicKey.toString());
    } catch (e) {
      alert(e);
    }
  };


  const handleSubmitPost = async () => {
    const anchorProvider = getAnchorProvider();
    const anoniContract = getContract(getAnchorProvider());
    const keypair = web3.Keypair.generate();
    try {
      const signature = await anoniContract.methods
        .createMessage(content)
        .accounts({
          message: keypair.publicKey,
          author: anchorProvider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
      setcontent("");
      alert("Please wait.");
      alert("Signature: " + signature.toString());
      onGetPosts;
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="relative min-h-screen">
        <h1 className="text-3xl font-bold mb-4 mt-8 text-center">Welcome to My App</h1>
        {connectedWallet ? (
          <>
            <div className="mt-4 text-lg text-center">
              Connected Wallet: {connectedWallet}
            </div>
            <div className="mb-4" style={{margin: "0 30px"}}>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={handleChange}
                  placeholder="Enter your post..."
                  className="border rounded-md p-2 pr-12" // Added pr-12 for padding on the right
                  style={{ width: "100%" }} // Set width to 100%
                />
                <button
                  onClick={handleSubmitPost}
                  className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                  style={{ marginTop: "8px", marginRight: "8px" }} // Adjusted margin for the button
                >
                  Post
                </button>
              </div>
            </div>
            <div className="mb-4 flex flex-items">
              <button
                  onClick={onGetPosts}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 ml-2 rounded-md"
                  style={{ margin: "0 auto" }}
                >
                  Refresh
                </button>
            </div>
          </>
        ) : (
          <div className="mb-4 flex flex-items">
            <button
              onClick={onConnectWallet}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              style = {{ margin: "0 auto" }}
            >
              Connect your Phantom wallet
            </button>
          </div>
        )}
        <div>
          {posts.map((e: any) => (
            <div
              key={e.publicKey.toString()}
              style={{ border: "1px solid grey", padding: "10px", margin: "0 30px" }}
            >
              <p className="text-xs">Author: {e.account.author.toString()}</p>
              <p>{e.account.content}</p>
              <p className="text-xs">{new Date(e.account.timestamp.toNumber() * 1000).toLocaleString()}</p>
            </div>
          ))}
          </div>
        </div>
  );
}

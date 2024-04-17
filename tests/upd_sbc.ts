import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UpdSbc } from "../target/types/upd_sbc";
import * as assert from "assert";

describe("upd_sbc", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.UpdSbc as Program<UpdSbc>;

  it("Can create a message", async () => {
    const message = anchor.web3.Keypair.generate();
    const messageContent = "Hello World!";
    const tx = await program.methods
      .createMessage(messageContent)
      .accounts({
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([message])
      .rpc();
    console.log("Your transaction signature", tx);

    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    assert.equal(
      messageAccount.author.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
    assert.equal(messageAccount.content, messageContent);
    assert.ok(messageAccount.timestamp);
  });
});

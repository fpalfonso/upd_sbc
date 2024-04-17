use anchor_lang::prelude::*;

declare_id!("GCGcqanABcRwwfVXyma59p8H1mX7KPNLwodbdG9Ee1g7");

#[program]
pub mod upd_sbc {
    use super::*;

    pub fn create_message(ctx: Context<CreateMessage>, content: String) -> Result<()> {
        let message: &mut Account<Message> = &mut ctx.accounts.message;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();
    
        message.author = *author.key;
        message.timestamp = clock.unix_timestamp;
        message.content = content;
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMessage<'info> {
    #[account(init, payer = author, space = 1000)]
    pub message: Account<'info, Message>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Message {
    pub author: Pubkey,
    pub timestamp: i64,
    pub content: String,
}
use anchor_lang::prelude::*;

declare_id!("GCGcqanABcRwwfVXyma59p8H1mX7KPNLwodbdG9Ee1g7");

#[program]
pub mod upd_sbc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFundsInfo = mutation({
  args: {
    fundsData: v.array(
      v.object({
        fund_id: v.number(),
        name: v.string(),
        short_name: v.string(),
        code: v.string(),
        fund_url: v.string(),
        fund_type: v.string(),
        fund_status: v.string(),
        avatar_url: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    const insertedIds = await Promise.all(
      args.fundsData.map(async (fundData) => {
        const dataToInsert = {
          user: user[0]._id,
          fund_id: fundData.fund_id,
          name: fundData.name,
          short_name: fundData.short_name,
          code: fundData.code,
          fund_url: fundData.fund_url,
          fund_type: fundData.fund_type,
          fund_status: fundData.fund_status,
          avatar_url: fundData.avatar_url,
        };
        return await ctx.db.insert("fundInfo", dataToInsert);
      })
    );

    return insertedIds;
  },
});

export const getAllFundInfo = query({
  handler: async (ctx) => {
    const funds = await ctx.db.query("fundInfo").collect();
    return funds;
  },
});

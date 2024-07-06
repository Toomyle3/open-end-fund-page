import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFunds = mutation({
  args: {
    Date: v.string(),
    DCDS: v.union(v.float64(), v.string()),
    DCDE: v.union(v.float64(), v.string()),
    DCBF: v.union(v.float64(), v.string()),
    DCIP: v.union(v.float64(), v.string()),
    E1VFVN30: v.union(v.float64(), v.string()),
    FUEVFVND: v.union(v.float64(), v.string()),
    FUEDCMID: v.union(v.float64(), v.string()),
    TCEF: v.union(v.float64(), v.string()),
    TCBF: v.union(v.float64(), v.string()),
    TCFF: v.union(v.float64(), v.string()),
    TCFIN: v.union(v.float64(), v.string()),
    VCBFMGF: v.union(v.float64(), v.string()),
    VCBFTBF: v.union(v.float64(), v.string()),
    VCBFBCF: v.union(v.float64(), v.string()),
    VCBFFIF: v.union(v.float64(), v.string()),
    VESAF: v.union(v.float64(), v.string()),
    VEOF: v.union(v.float64(), v.string()),
    VIBF: v.union(v.float64(), v.string()),
    VFF: v.union(v.float64(), v.string()),
    VLBF: v.union(v.float64(), v.string()),
    FUEVN100: v.union(v.float64(), v.string()),
    SSISCA: v.union(v.float64(), v.string()),
    SSIBF: v.union(v.float64(), v.string()),
    VLGF: v.union(v.float64(), v.string()),
    FUESSV50: v.union(v.float64(), v.string()),
    FUESSVFL: v.union(v.float64(), v.string()),
    FUESSV30: v.union(v.float64(), v.string()),
    BVFED: v.union(v.float64(), v.string()),
    BVBF: v.union(v.float64(), v.string()),
    BVPF: v.union(v.float64(), v.string()),
    ENF: v.union(v.float64(), v.string()),
    VNDAF: v.union(v.float64(), v.string()),
    VNDBF: v.union(v.float64(), v.string()),
    FUEIP100: v.union(v.float64(), v.string()),
    MAFEQI: v.union(v.float64(), v.string()),
    MAFBAL: v.union(v.float64(), v.string()),
    MBVF: v.union(v.float64(), v.string()),
    MBBOND: v.union(v.float64(), v.string()),
    FUEMAV30: v.union(v.float64(), v.string()),
    FUEKIV30: v.union(v.float64(), v.string()),
    FUEKIVFS: v.union(v.float64(), v.string()),
    VNINDEX: v.union(v.float64(), v.string()),
    VN30: v.union(v.float64(), v.string()),
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

    const fundData = {
      user: user[0]._id,
      Date: args.Date,
      DCDS: args.DCDS,
      DCDE: args.DCDE,
      DCBF: args.DCBF,
      DCIP: args.DCIP,
      E1VFVN30: args.E1VFVN30,
      FUEVFVND: args.FUEVFVND,
      FUEDCMID: args.FUEDCMID,
      TCEF: args.TCEF,
      TCBF: args.TCBF,
      TCFF: args.TCFF,
      TCFIN: args.TCFIN,
      VCBFMGF: args.VCBFMGF,
      VCBFTBF: args.VCBFTBF,
      VCBFBCF: args.VCBFBCF,
      VCBFFIF: args.VCBFFIF,
      VESAF: args.VESAF,
      VEOF: args.VEOF,
      VIBF: args.VIBF,
      VFF: args.VFF,
      VLBF: args.VLBF,
      FUEVN100: args.FUEVN100,
      SSISCA: args.SSISCA,
      SSIBF: args.SSIBF,
      VLGF: args.VLGF,
      FUESSV50: args.FUESSV50,
      FUESSVFL: args.FUESSVFL,
      FUESSV30: args.FUESSV30,
      BVFED: args.BVFED,
      BVBF: args.BVBF,
      BVPF: args.BVPF,
      ENF: args.ENF,
      VNDAF: args.VNDAF,
      VNDBF: args.VNDBF,
      FUEIP100: args.FUEIP100,
      MAFEQI: args.MAFEQI,
      MAFBAL: args.MAFBAL,
      MBVF: args.MBVF,
      MBBOND: args.MBBOND,
      FUEMAV30: args.FUEMAV30,
      FUEKIV30: args.FUEKIV30,
      FUEKIVFS: args.FUEKIVFS,
      VNINDEX: args.VNINDEX,
      VN30: args.VN30,
    };

    return await ctx.db.insert("funds", fundData);
  },
});

export const getAllFunds = query({
  handler: async (ctx) => {
    const funds = await ctx.db.query("funds").collect();
    return funds;
  },
});

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
        };
        return await ctx.db.insert("fundInfo", dataToInsert);
      })
    );

    return insertedIds;
  },
});

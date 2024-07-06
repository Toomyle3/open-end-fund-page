import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFunds = mutation({
  args: {
    Date: v.string(),
    DCDS: v.string(),
    DCDE: v.string(),
    DCBF: v.string(),
    DCIP: v.string(),
    E1VFVN30: v.string(),
    FUEVFVND: v.string(),
    FUEDCMID: v.string(),
    TCEF: v.string(),
    TCBF: v.string(),
    TCFF: v.string(),
    TCFIN: v.string(),
    VCBFMGF: v.string(),
    VCBFTBF: v.string(),
    VCBFBCF: v.string(),
    VCBFFIF: v.string(),
    VESAF: v.string(),
    VEOF: v.string(),
    VIBF: v.string(),
    VFF: v.string(),
    VLBF: v.string(),
    FUEVN100: v.string(),
    SSISCA: v.string(),
    SSIBF: v.string(),
    VLGF: v.string(),
    FUESSV50: v.string(),
    FUESSVFL: v.string(),
    FUESSV30: v.string(),
    BVFED: v.string(),
    BVBF: v.string(),
    BVPF: v.string(),
    ENF: v.string(),
    VNDAF: v.string(),
    VNDBF: v.string(),
    FUEIP100: v.string(),
    MAFEQI: v.string(),
    MAFBAL: v.string(),
    MBVF: v.string(),
    MBBOND: v.string(),
    FUEMAV30: v.string(),
    FUEKIV30: v.string(),
    FUEKIVFS: v.string(),
    VNINDEX: v.string(),
    VN30: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const fundData = {
      user: user._id,
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

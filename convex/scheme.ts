import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  funds: defineTable({
    Date: v.string(),
    BVBF: v.union(v.float64(), v.string()),
    BVFED: v.union(v.float64(), v.string()),
    BVPF: v.union(v.float64(), v.string()),
    DCBF: v.union(v.float64(), v.string()),
    DCDE: v.union(v.float64(), v.string()),
    DCDS: v.union(v.float64(), v.string()),
    DCIP: v.union(v.float64(), v.string()),
    E1VFVN30: v.union(v.float64(), v.string()),
    ENF: v.union(v.float64(), v.string()),
    FUEDCMID: v.union(v.float64(), v.string()),
    FUEIP100: v.union(v.float64(), v.string()),
    FUEKIV30: v.union(v.float64(), v.string()),
    FUEKIVFS: v.union(v.float64(), v.string()),
    FUEMAV30: v.union(v.float64(), v.string()),
    FUESSV30: v.union(v.float64(), v.string()),
    FUESSV50: v.union(v.float64(), v.string()),
    FUESSVFL: v.union(v.float64(), v.string()),
    FUEVFVND: v.union(v.float64(), v.string()),
    FUEVN100: v.union(v.float64(), v.string()),
    MAFBAL: v.union(v.float64(), v.string()),
    MAFEQI: v.union(v.float64(), v.string()),
    MBBOND: v.union(v.float64(), v.string()),
    MBVF: v.union(v.float64(), v.string()),
    SSIBF: v.union(v.float64(), v.string()),
    SSISCA: v.union(v.float64(), v.string()),
    TCBF: v.union(v.float64(), v.string()),
    TCEF: v.union(v.float64(), v.string()),
    TCFF: v.union(v.float64(), v.string()),
    TCFIN: v.union(v.float64(), v.string()),
    VCBFBCF: v.union(v.float64(), v.string()),
    VCBFFIF: v.union(v.float64(), v.string()),
    VCBFMGF: v.union(v.float64(), v.string()),
    VCBFTBF: v.union(v.float64(), v.string()),
    VEOF: v.union(v.float64(), v.string()),
    VESAF: v.union(v.float64(), v.string()),
    VFF: v.union(v.float64(), v.string()),
    VIBF: v.union(v.float64(), v.string()),
    VLBF: v.union(v.float64(), v.string()),
    VLGF: v.union(v.float64(), v.string()),
    VN30: v.union(v.float64(), v.string()),
    VNDAF: v.union(v.float64(), v.string()),
    VNDBF: v.union(v.float64(), v.string()),
    VNINDEX: v.float64(),
  }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});

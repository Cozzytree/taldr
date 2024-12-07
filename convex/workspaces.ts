import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const getuserWorkspaces = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    if (identity.tokenIdentifier.split("|")[1] !== userId) {
      throw new Error("unauthorized");
    }

    return await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()
      .catch((err) => {
        if (err instanceof ConvexError) {
          throw new Error(err.message || "internal server errori");
        }
      });
  },
});

const updateShapes = mutation({
  args: {
    userId: v.string(),
    shapes: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { shapes, userId, workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    const found = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), workspaceId))
      .first();

    if (!found) {
      throw new Error("workspace not found");
    }

    if (found.userId !== userId) {
      throw new Error("unauthorized");
    }

    await ctx.db.patch(workspaceId, { shapes }).catch((err) => {
      if (err instanceof ConvexError) {
        throw new Error(err.message || "internal server error");
      }
    });
  },
});

const updateDocument = mutation({
  args: {
    userId: v.string(),
    document: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { document, userId, workspaceId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    const found = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), workspaceId))
      .first();

    if (!found) {
      throw new Error("workspace not found");
    }

    if (found.userId !== userId) {
      throw new Error("unauthorized");
    }

    await ctx.db.patch(workspaceId, { document }).catch((err) => {
      if (err instanceof ConvexError) {
        throw new Error(err.message || "internal server error");
      }
    });
  },
});

const updateWorkspaceName = mutation({
  args: { name: v.string(), id: v.id("workspaces"), userId: v.string() },
  handler: async (ctx, { id, name, userId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    const f = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    if (f == null) {
      throw new Error("workspace not found");
    }

    if (f.userId !== userId) {
      throw new Error("unauthorized");
    }

    await ctx.db.patch(id, { name: name }).catch((err) => {
      if (err instanceof ConvexError) {
        throw new Error(err.message || "internal server error");
      }
    });

    const updated = await ctx.db.get(id);
    return updated;
  },
});

const updateWorkspaceDescription = mutation({
  args: { description: v.string(), id: v.id("workspaces"), userId: v.string() },
  handler: async (ctx, { id, description, userId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    const f = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    if (f == null) {
      throw new Error("workspace not found");
    }

    if (f.userId !== userId) {
      throw new Error("unauthorized");
    }

    await ctx.db.patch(id, { description }).catch((err) => {
      if (err instanceof ConvexError) {
        throw new Error(err.message || "internal server error");
      }
    });

    const updated = await ctx.db.get(id);
    return updated;
  },
});

const getWorkspace = query({
  args: { id: v.id("workspaces"), userId: v.optional(v.string()) },
  handler: async (ctx, { id }) => {
    const found = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), id))
      .first()
      .catch((err) => {
        if (err instanceof ConvexError) {
          throw new Error(err.message || "internal server error");
        }
      });

    return found;
  },
});

const createWorkspace = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, { name, userId, description }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    if (identity.tokenIdentifier.split("|")[1] !== userId) {
      throw new Error("unauthorized");
    }

    return await ctx.db
      .insert("workspaces", {
        name,
        description: description || "",
        userId,
        document: "",
        shapes: "",
      })
      .catch((err) => {
        if (err instanceof ConvexError) {
          throw new Error(err.message || "internal server error");
        }
      });
  },
});

const deleteWorkspace = mutation({
  args: { id: v.id("workspaces"), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity == null) {
      throw new Error("unauthorized");
    }

    const found = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("_id"), id))
      .first()
      .catch((err) => {
        if (err instanceof ConvexError) {
          throw new Error(err.message || "internal server errori");
        }
      });

    if (found?.userId !== userId) {
      throw new Error("unauthorized");
    }

    await ctx.db.delete(id).catch((err) => {
      if (err instanceof ConvexError) {
        throw new Error(err.message || "internal server error");
      }
    });

    return "successfully deleted";
  },
});

export {
  updateShapes,
  getWorkspace,
  updateDocument,
  deleteWorkspace,
  createWorkspace,
  getuserWorkspaces,
  updateWorkspaceName,
  updateWorkspaceDescription,
};

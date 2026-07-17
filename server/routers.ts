import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getOrderById,
  createOrderItem,
} from "./db";

const ADMIN_CODE = "44774";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(async () => {
      const prods = await getProducts();
      return prods.map(p => ({
        ...p,
        price: parseFloat(p.price as unknown as string),
      }));
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      const prod = await getProductById(input);
      if (!prod) return null;
      return {
        ...prod,
        price: parseFloat(prod.price as unknown as string),
      };
    }),
    getByCategory: publicProcedure.input(z.number()).query(async ({ input }) => {
      const prods = await getProductsByCategory(input);
      return prods.map(p => ({
        ...p,
        price: parseFloat(p.price as unknown as string),
      }));
    }),
    featured: publicProcedure.query(async () => {
      const prods = await getFeaturedProducts();
      return prods.map(p => ({
        ...p,
        price: parseFloat(p.price as unknown as string),
      }));
    }),
    create: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          categoryId: z.number(),
          name: z.string(),
          description: z.string().optional(),
          price: z.number(),
          imageUrl: z.string().optional(),
          stock: z.number().default(0),
          featured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        const { adminCode, ...data } = input;
        await createProduct({
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          imageUrl: data.imageUrl,
          stock: data.stock,
          featured: data.featured,
        });
      }),
    update: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          id: z.number(),
          categoryId: z.number().optional(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          imageUrl: z.string().optional(),
          stock: z.number().optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        const { adminCode, id, ...data } = input;
        const updateData: any = {};
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price.toString();
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.featured !== undefined) updateData.featured = data.featured;
        await updateProduct(id, updateData);
      }),
    delete: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          id: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        await deleteProduct(input.id);
      }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(async () => {
      return getCategories();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return getCategoryById(input);
    }),
    create: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          name: z.string(),
          description: z.string().optional(),
          slug: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        const { adminCode, ...data } = input;
        await createCategory(data);
      }),
    update: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          slug: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        const { adminCode, id, ...data } = input;
        await updateCategory(id, data);
      }),
    delete: publicProcedure
      .input(
        z.object({
          adminCode: z.string(),
          id: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.adminCode !== ADMIN_CODE) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin code",
          });
        }
        await deleteCategory(input.id);
      }),
  }),

  // Cart
  cart: router({
    getItems: publicProcedure.input(z.string()).query(async ({ input: sessionId }) => {
      const items = await getCartItems(sessionId);
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return {
            ...item,
            product: product
              ? {
                  ...product,
                  price: parseFloat(product.price as unknown as string),
                }
              : null,
          };
        })
      );
      return itemsWithProducts;
    }),
    addItem: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          productId: z.number(),
          quantity: z.number().default(1),
        })
      )
      .mutation(async ({ input }) => {
        await addToCart(input.sessionId, input.productId, input.quantity);
      }),
    updateItem: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          productId: z.number(),
          quantity: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        await updateCartItem(input.sessionId, input.productId, input.quantity);
      }),
    removeItem: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          productId: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        await removeFromCart(input.sessionId, input.productId);
      }),
    clear: publicProcedure.input(z.string()).mutation(async ({ input: sessionId }) => {
      await clearCart(sessionId);
    }),
  }),

  // Orders
  orders: router({
    create: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.number(),
            })
          ),
          total: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const order = await createOrder(input.sessionId, input.total);
        // Get the inserted order ID - need to query it back
        const orderId = (order as any).insertId;
        
        // Create order items
        for (const item of input.items) {
          await createOrderItem(orderId, item.productId, item.quantity, item.price.toString());
        }
        
        // Clear cart
        await clearCart(input.sessionId);
        
        return { orderId, status: "confirmed" };
      }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return getOrderById(input);
    }),
  }),
});

export type AppRouter = typeof appRouter;

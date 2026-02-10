import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts=pgTable("accounts",{
    id:text("id").primaryKey(),
    name:text("name").notNull(),
    plaidId:text("plaidId"),
    userId:text("userId").notNull(),  
})
export const accountRelations = relations(accounts,({many})=>({
    transactions:many(transactions)
}))
export const accountZodSchema=createSelectSchema(accounts)
export const category=pgTable("categories",{
    id:text("id").primaryKey(),
    name:text("name").notNull(),
    plaidId:text("plaidId"),
    userId:text("userId").notNull(),  
})
export const categoryZodSchema=createSelectSchema(category)
export const categoriyRelations = relations(category,({many})=>({
    transactions:many(transactions)
}))
export const transactions=pgTable("transactions",{
    id:text("id").primaryKey(),
    amount:integer("amount").notNull(),
    payee:text("payee").notNull(),
    notes:text("notes"),
    date:timestamp("date",{mode:"date"}).notNull(),
    accountId:text("accountId").references(()=>accounts.id,{
        onDelete:"cascade"
    }).notNull(),
    categoryId:text("categoryId").references(()=>category.id,{
        onDelete:"set null"
    })
})
export const transactionsRelations=relations(transactions,({one})=>({
    accounts:one(accounts,{
        fields:[transactions.accountId],
        references:[accounts.id]
    }),
    category:one(category,{
        fields:[transactions.categoryId],
        references:[category.id]
    })
}))
export const transactionsZodSchema=createSelectSchema(transactions,{
    date:z.coerce.date()
}).extend({
    notes:z.string().nullable().optional(),
    categoryId:z.string().nullable().optional()
})
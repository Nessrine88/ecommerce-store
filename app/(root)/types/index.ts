import z from "zod";
import { insertProductSchema } from "@/app/lib/validators";
export type Product = z.infer <typeof insertProductSchema> & {
    id:string;
    rating:number;
    createdAt: Date;
}
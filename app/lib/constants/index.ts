export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store build with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_URL_SERVER || "http://localhost:3000";
  export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

  export const signInDefaultValues = {
    email: '',
    password:'',
  }
 export const signUpDefaultValues = {
  name: '',
    email: '',
    password:'',
    confirmPassword: ''
  }

// export async function formatError(error: any) {
//   if (error.name === "ZodError") {
//     // Zod exposes issues as an array: [{ path, message, ... }, ...]
//     const fieldErrors = error.issues.map((issue: any) => issue.message)
//     return fieldErrors.join(". ")
//   } else if (
//     error.name === "PrismaClientKnownRequestError" &&
//     error.code === "P2002"
//   ) {
//     const field = error.meta?.target?.[0] ?? "Field"
//     return `${field} already exists`
//   } else {
//     return typeof error.message === "string"
//       ? error.message
//       : "An unexpected error occurred"
//   }
// }

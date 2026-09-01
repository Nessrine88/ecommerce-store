import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Example auth function (replace with your actual auth logic like Clerk, NextAuth, etc.)
const auth = (req: Request) => ({ id: "user1" });

export const ourFileRouter = {
  // Define an endpoint route named "imageUploader"
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware runs on your server before upload starts
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    // OnUploadComplete runs on your server after the file is uploaded
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

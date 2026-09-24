import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/[locale]/components/ui/card";
import { Link } from "@/navigation";
import Image from "next/image";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{
    locale: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale,
    namespace: "SignInPage",
  });

  return {
    title: t("title"),
  };
}

const SignInPage = async (props: {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const t = await getTranslations("SignInPage");

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="m-auto w-full max-w-md p-5 text-accent">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/logo.svg"
              width={500}
              height={500}
              alt={t("logoAlt")}
              className="mx-auto h-auto w-28 rounded-full border border-accent"
            />
          </Link>
        </CardHeader>

        <CardTitle className="text-center">
          {t("title")}
        </CardTitle>

        <CardDescription className="text-center">
          {t("description")}
        </CardDescription>

        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
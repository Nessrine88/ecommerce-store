import { getTranslations } from "next-intl/server";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/[locale]/components/ui/table";
import { Metadata } from "next";
import { formatId } from "@/lib/utils";
import { Button } from "@/app/[locale]/components/ui/button";
import { Link } from "@/navigation";
import Pagination from "@/app/[locale]/components/shared/pagination";
import { Badge } from "@/app/[locale]/components/ui/badge";
import DeleteDialog from "@/app/[locale]/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "Admin Users",
};

const AdminUserPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  const t = await getTranslations("AdminUsers");

  const { page = "1", query: searchText } =
    await props.searchParams;

  const currentPage = Number(page) || 1;

  const users = await getAllUsers({
    page: currentPage,
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="font-bold">
          {t("title")}
        </h1>

        {searchText && (
          <div>
            {t("filteredBy")}{" "}
            <i>&quot;{searchText}&quot;</i>{" "}
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                {t("removeFilter")}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {formatId(user.id)}
                </TableCell>

                <TableCell>
                  {user.name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">
                      {t("user")}
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      {t("admin")}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="flex items-center gap-2">
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="outline" size="sm">
                      {t("update")}
                    </Button>
                  </Link>

                  <div className="rounded-sm bg-red-700">
                    <DeleteDialog
                      id={user.id}
                      action={deleteUser}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.totalPages >= 1 && (
          <Pagination
            page={currentPage}
            totalPages={users.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
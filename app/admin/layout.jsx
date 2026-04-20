import AdminLayout from "@/components/admin/AdminLayout";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "GoCart. - Admin",
  description: "GoCart. - Admin",
};

export default async function RootAdminLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignIn fallbackRedirectUrl="/admin" routing="hash" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <main className="page-float-in">{children}</main>
    </AdminLayout>
  );
}

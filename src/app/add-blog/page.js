import { redirect } from "next/navigation";

export default function AddBlogRedirectPage() {
  redirect("/blogs/add");
}

import { redirect } from "next/navigation";

// Platform routes are disabled in the current MVP.
// All traffic (authenticated or not) goes to the public site.
export default function PlatformLayout() {
  redirect("/");
}

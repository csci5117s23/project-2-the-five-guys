import { useRouter } from "next/router";

// Redirect user to the home page to let them sign in
export default function RedirectToHome() {
  const router = useRouter();
  router.push('/');
}
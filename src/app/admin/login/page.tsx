import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-xl border p-6 shadow-sm"
      >
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Masuk untuk mengelola isi halaman.
          </p>
        </div>

        <input type="hidden" name="next" value={next} />

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">Password salah, coba lagi.</p>
        )}

        <Button type="submit" className="w-full">
          Masuk
        </Button>
      </form>
    </div>
  );
}

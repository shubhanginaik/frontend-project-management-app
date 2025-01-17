import { SignupForm } from "@/components/singup-form"
import { useTheme } from "@/context/ThemeContext"

export function SignupPage() {
  const { theme } = useTheme()

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center p-6 md:p-10 ${
        theme === "dark" ? "bg-background text-foreground" : "bg-muted"
      }`}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
}

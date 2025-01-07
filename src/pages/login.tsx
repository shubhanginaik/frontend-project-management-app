import { LoginForm } from "../components/login-form"
import { SingUpForm } from "../components/singup-form"

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
        {/* <SingUpForm /> */}
      </div>
    </div>
  )
}

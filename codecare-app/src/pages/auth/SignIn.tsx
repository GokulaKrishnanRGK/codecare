import { SignIn } from "@clerk/clerk-react"

export default function SignInPage() {
    return <SignIn path="/signin" signUpUrl="/signup" fallbackRedirectUrl='/signedIn' signUpFallbackRedirectUrl='/signedUp' afterSignOutUrl='/signedOut' />;
}
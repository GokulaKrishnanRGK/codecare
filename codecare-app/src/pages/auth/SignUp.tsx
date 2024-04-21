import {SignUp} from "@clerk/clerk-react"

export default function SignUpPage() {
    return <SignUp path="/signup" signInUrl='/signin' fallbackRedirectUrl='/signedUp' signInFallbackRedirectUrl='/signedIn' afterSignOutUrl='/signedOut'/>
}

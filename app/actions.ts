"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    // Define other properties of JwtPayload if needed
    email: string;
    // Other properties...
}

const expiresInSeconds = 3600; // Expiration time in seconds (e.g., 1 hour)
const expirationTime = new Date();
expirationTime.setTime(expirationTime.getTime() + expiresInSeconds * 1000);

function setJWTCookie(jwt: string, date: Date) {
    cookies().set({
        name: "accessToken",
        value: jwt,
        httpOnly: true,
        secure: true,
        path: "/",
        expires: date,
    });
}

//Actions called from login form in login page
export async function loginAction(formData: FormData) {
    let res = await fetch("http://localhost:8080/login", {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
        }),
    });
    let data = await res.json();
    console.log(res.status);
    console.log(data);
    if (res.status == 200) {
        setJWTCookie(data.accessToken, expirationTime);
    }
    // Explicitly define the type of decoded data as JwtPayload
    const userData: JwtPayload = jwtDecode(data.accessToken);
    return { email: userData.email };
}

//get User session
export async function getSession() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    if (accessToken) {
        let userData: JwtPayload = jwtDecode(accessToken.value);
        return { email: userData.email };
    }
    return null;
}

"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const expiresInSeconds = 3600; // Expiration time in seconds (e.g., 1 hour)
const expirationTime = new Date();
expirationTime.setTime(expirationTime.getTime() + expiresInSeconds * 1000);

function setTokenCookie(tokenValue: string, date: Date) {
    cookies().set({
        name: "session_id",
        value: tokenValue,
        httpOnly: true,
        secure: true,
        path: "/",
        expires: date,
    });
}

//Actions called from login form in login page
export async function loginAction(formData: FormData) {
    //console.log(formData);
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
    if (res.status == 200) {
        console.log(data);
        setTokenCookie(data.sessionID, expirationTime);
        //const userData: JwtPayload = jwtDecode(data.sessionID);
        return { status: 200, message: "success", email: data.email };
    }
    return { status: 400, message: "Wrong Email or Password" };
}

//get User session
export async function getSession() {
    const cookieList = cookies();
    if (cookieList.has("session_id")) {
        const sessionID = cookieList.get("session_id");
        if (sessionID) {
            let res = await fetch("http://localhost:8080/user-info", {
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookies().toString(),
                },
            });
            let data = await res.json();
            return { email: data.email };
        }
    }
    return null;
}

export async function logOut() {
    const cookieList = cookies();
    if (cookieList.has("session_id")) {
        cookies().delete("session_id");
    }
    return { status: 200 };
}

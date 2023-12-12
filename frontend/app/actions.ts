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

export async function signUpAction(formData: FormData) {
    let res = await fetch("http://localhost:8080/sign-up", {
        method: "POST",
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
        }),
    });
    let data = await res.json();
    if (res.status == 200) {
        console.log(data);
        setTokenCookie(data.sessionID, expirationTime);
        //const userData: JwtPayload = jwtDecode(data.sessionID);
        return {
            status: 200,
            message: "success",
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
        };
    }
    return { status: 400, message: "Email already exist" };
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
        return {
            status: 200,
            message: "success",
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
        };
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
            if (res.status == 400) {
                cookies().delete("session_id");
                return null;
            }
            return { id: data.id, username: data.username, email: data.email };
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

interface Character {
    name: string | null | undefined;
    title: string | null | undefined;
    description: string | null | undefined;
    universe: string | null | undefined;
    cover_pic: string | null | undefined;
    cover_bg: string | null | undefined;
    skills: {
        pic: string | null | undefined;
        title: string | null | undefined;
        description: string | null | undefined;
    }[];
}

export async function createCharacter(characterData: Character) {
    console.log(characterData);
    let res = await fetch("http://localhost:8080/create-character", {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        method: "POST",
        body: JSON.stringify(characterData),
    });
    let data = await res.json();
    console.log(data);
    if (res.status == 200) {
        return { status: 200, characterData: data };
    }
    return { status: 400 };
}

export async function getCharactersAction() {
    const res = await fetch("http://localhost:8080/characters", {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
    });
    return res.json();
}

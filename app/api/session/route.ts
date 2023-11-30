import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken");
    const accessToken = cookieStore.get("accessToken");
    let response: NextResponse;
    if (accessToken) {
        let userData = jwtDecode(accessToken.value);
        response = NextResponse.json({
            status: 200,
            message: "Authorized Access",
            userData: userData,
        });
        return response;
    }
}

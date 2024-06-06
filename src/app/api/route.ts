import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from the API!' })
}
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { username, password } = body;
    if (username === 'tharun@gmail.com' && password === '1234') {
        // set cookies
        cookies().set({
            name: 'token',
            value: 'tharun_secret_token',
            httpOnly: false,
            maxAge: 60 * 60,
            path: '/',
        });
        return NextResponse.json({ message: 'Login successful' })
    }
    else {
        return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }
}

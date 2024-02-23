import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();
        const verifyToken: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET ?? "");

        if (verifyToken.exp < Date.now() / 1000) {
            return new NextResponse(JSON.stringify({ error: "Expired" }),
                { status: 400 }
            );
        }
        const json_response = {
            status: 200,
            result: "Authenticated"
        }
        return new NextResponse(JSON.stringify(json_response))
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Authentication Error" }),
            { status: 400 }
        );
    }
}
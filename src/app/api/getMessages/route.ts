import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prismaClient";


export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session && !_user) {
        return Response.json(
            { success: false, message: 'User not authenticated' },
            { status: 401 }
        );
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                id: _user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        return Response.json(
            { messages }, { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching messages:', error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }

}
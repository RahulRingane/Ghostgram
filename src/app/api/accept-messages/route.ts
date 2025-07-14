import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prismaClient";

export async  function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            {
                status: 401
            }
        );
    }

    const userId = user.id;
    const { acceptMessages } = await request.json();

    try {
        // Update the users message acceptance status
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isAcceptingMessages: acceptMessages,  
            }
        });

        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error('Error updating message acceptace status: ', error);
        return Response.json(
            {
                success: false,
                message: 'error updating message acceptace status'
            },
            {
                status: 500
            }
        );
    }
}
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    //check if the user is authenticated
    if(!session && !user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            {
                status: 401
            }
        );
    }

    try {
        // Retrive the user from the database using the ID
        const foundUser = await prisma.user.findFirst({
            where: {
                id: user.id
            }
        })

        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                {
                    status: 404
                }
            );
        }

        // return users message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error('Error retriving message acceptance status:', error);
        return Response.json(
            {
                success: false,
                message: 'Error retriving message acceptance status'
            },
            {
                status: 500
            }
        );
    }
}


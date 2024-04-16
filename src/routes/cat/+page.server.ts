import type { Actions } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
    createCat: async ({ request }) => {
        const { name, color } = Object.fromEntries(await request.formData()) as { name: string, color: string };

        try {
            await prisma.cat.create({
                data: { name, color }
            })
        } catch (err) {
            console.error(err)
            return fail(500, { message: 'Could not create the cat.'})
        }
    
        return {
            status: 201
        }
    }
}
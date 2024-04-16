import type { Actions } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        cats: await prisma.cat.findMany()
    }
};

export const actions: Actions = {
    deleteCat: async ({ url }) => {
        const id = url.searchParams.get('id');
        if (!id) return fail(400, { message: 'Invalid request' });

        try {
            await prisma.cat.delete({
                where: { id: Number(id) }
            }) 
        } catch (err) {
            console.error(err)
            return fail(500, { message: 'Something went wrong deleting the cat'})
        }

        return {
            status: 200
        }
    }
}
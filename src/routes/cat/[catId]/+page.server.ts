import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { error, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const getCat = async () => {
        const cat = await prisma.cat.findUnique({
            where: { id: Number(params.catId) }
        })
        if (!cat) throw error(404, 'Cat not found')
        return cat
    }

    return {
        cat: await getCat()
    }
}

export const actions: Actions = {
    updateCat: async ({ request, params }) => {
        const { name, color } = Object.fromEntries(await request.formData()) as { name: string, color: string }

        try {
            await prisma.cat.update({
                where: { id: Number(params.catId) },
                data: { name, color }
            })
        } catch (err) {
            console.error(err)
            return fail(500, { message: 'Could not update the cat' })
        }

        return {
            status: 200
        }
    }
};
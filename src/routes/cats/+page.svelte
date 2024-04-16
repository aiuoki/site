<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    $: ({ cats } = data);
</script>

<div>

</div>

<div class="h-screen flex justify-center items-center">
    <div class="h-max card shrink-0 w-full max-w-md shadow-2xl bg-base-100 text-center p-4 flex items-center gap-4">
        <h1>Cats</h1>
        <div class="border border-gray-200 shadow shadow-gray-200 w-64 carousel rounded-box">
            {#each cats as cat}
                <div class="pt-4 pb-4 carousel-item w-full flex flex-col gap-4">
                    <p>{ cat.name } <span>{ cat.color }</span></p>
                    <form action="?/deleteCat&id={cat.id}" method="POST">
                        <button type="submit" class="btn btn-outline btn-sm">Delete Cat</button>
                    </form>
                    <a href="/cat/{cat.id}" class="label-text-alt link link-hover">Edit Cat</a>
                </div>
            {/each}
        </div>
        <a href="/cat" class="label-text-alt link link-hover">Create a Cat</a>
    </div>
</div>

<style>
</style>
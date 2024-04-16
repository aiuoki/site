<div class="h-screen flex justify-center items-center">
    <div class="h-max card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form action="?/createCat" method="POST" class="card-body">
            <div class="form-control">
                <label for="name" class="label">
                    <span class="label-text">Name</span>
                </label>
                <input type="text" name="name" placeholder="name" class="input input-bordered input-secondary w-full max-w-xs" />
            </div>
            <div class="form-control">
                <label for="color" class="label">
                    <span class="label-text">Color</span>
                </label>
                <input type="text" name="color" placeholder="color" class="input input-bordered input-accent w-full max-w-xs" />
            </div>
            <div class="form-control mt-6">
                <button type="submit" class="btn btn-outline btn-primary">Create Cat</button>
                <label for="" class="label">
                    <a href="/cats" class="label-text-alt link link-hover">Go to cats?</a>
                </label>
            </div>
        </form>
    </div>
</div>
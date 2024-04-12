<script>
	import profile from '$lib/assets/profile.jpg';
</script>

<!-- svelte-ignore a11y-element-should-have-an-href-attribute -->

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl">danielceban</a>
	</div>
	<div class="flex-none gap-2">
		<div class="form-control">
			<input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
		</div>
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img alt="Tailwind CSS Navbar component" src={profile} />
				</div>
			</div>
			<ul
				tabindex="0"
				class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
			>
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li><a href="/">Logout</a></li>
			</ul>
		</div>
	</div>
</div>

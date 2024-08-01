<script>
	import { goto } from '$app/navigation';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row">
		<img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" class="max-w-sm rounded-lg shadow-2xl" alt="logo" />
		<div>
			<h1 class="text-5xl font-bold">My personal blog!</h1>
			<p class="py-6">
				Hi! I'm Daniel Ceban, a 20 year old passionate about programming and always looking for new
				challenges. Join me on this blog where I share my learning experiences, projects, and the
				latest trends in the tech world.
			</p>
			<button class="btn btn-primary" on:click={() => goto('/login')}>Get Started</button>
		</div>
	</div>
</div>

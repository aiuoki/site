<script>
	import { goto } from '$app/navigation';

	function getStarted() {
		goto('/login');
	}
</script>

<div
	class="hero min-h-screen"
	style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);"
>
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class="max-w-md">
			<h1 class="mb-5 text-5xl font-bold">Hello World</h1>
			<p class="mb-5">Website created by Daniel Ceban</p>
			<button on:click={getStarted} class="btn btn-primary">Get Started</button>
		</div>
	</div>
</div>

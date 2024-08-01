<script>
	import { goto } from '$app/navigation';

	let nick = '';
	let password = '';

	function login() {
		event?.preventDefault();
		if (nick === 'dan' && password === '123') {
			console.log(nick, password);
			goto('/main');
		} else {
			alert('Wrong credentials!');
		}
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Login now!</h1>
			<p class="py-6">
				Enter your credentials to access your account. If you have any problems contact with the
				administrator.
			</p>
		</div>
		<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<form class="card-body" on:submit={login}>
				<div class="form-control">
					<label class="label" for="nick">
						<span class="label-text">Nick</span>
					</label>
					<input
						type="text"
						bind:value={nick}
						placeholder="nick"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						bind:value={password}
						placeholder="password"
						class="input input-bordered"
					/>
				</div>
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">Login</button>

					<label class="label" for="fPasswd">
						<a href="#forgot" class="label-text-alt link link-hover mt-3" on:click={() => goto('/')}>Go back.</a>
					</label>
				</div>
			</form>
		</div>
	</div>
</div>

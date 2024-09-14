<script>
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/components/custom/navbar';
</script>

<main class="container">
	<Toaster position="top-center" richColors />
	<Navbar />
	<slot></slot>
</main>

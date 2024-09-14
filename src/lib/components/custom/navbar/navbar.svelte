<script lang="ts">
	import { CircleUser, Menu, PocketKnife } from 'lucide-svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import NavbarLink from './navbar-link.svelte';
	import { NavLinks } from './constants';
</script>

<header
	class="bg-background sticky top-0 my-4 flex h-16 items-center gap-4 rounded-lg px-4 shadow-md md:px-6"
>
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<a href="##" class="flex items-center gap-2 text-lg font-semibold md:text-base">
			<PocketKnife class="h-6 w-6" />

			<span class="sr-only">Swiss army knife</span>
		</a>
		{#each NavLinks as navLink}
			<NavbarLink {navLink} />
		{/each}
	</nav>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<nav class="grid gap-6 text-lg font-medium">
				<a href="##" class="flex items-center gap-2 text-lg font-semibold">
					<PocketKnife class="h-6 w-6" />
					<span class="sr-only">Swiss army knife</span>
				</a>
				{#each NavLinks as navLink}
					<NavbarLink {navLink} variant="sheet" />
				{/each}
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<div class="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
					<CircleUser class="h-5 w-5" />
					<span class="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Item>Support</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Logout</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>

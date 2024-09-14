<script lang="ts">
	import { page } from '$app/stores';
	import type { NavLink } from './constants';

	const classes = {
		default: {
			inactive: 'text-muted-foreground hover:text-foreground transition-colors',
			active: 'text-foreground hover:text-foreground transition-colors'
		},
		sheet: {
			inactive: 'text-muted-foreground hover:text-foreground',
			active: 'hover:text-foreground'
		}
	};

	export let navLink: NavLink;
	export let variant: 'default' | 'sheet' = 'default';

	const isActive = (pathname: string) =>
		navLink.isRoot ? pathname === '/' : pathname.startsWith(navLink.href);

	$: _class = isActive($page.url.pathname) ? classes[variant].active : classes[variant].inactive;
</script>

<a href={navLink.href} class={_class}>
	{navLink.title}
</a>

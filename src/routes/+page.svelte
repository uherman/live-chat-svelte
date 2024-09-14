<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { onDestroy, onMount } from 'svelte';
	import { ws } from '$lib/socket.js';
	import { CornerDownLeft, Unplug } from 'lucide-svelte';

	import Paperclip from 'lucide-svelte/icons/paperclip';
	import Mic from 'lucide-svelte/icons/mic';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	type Message = {
		user: string;
		message: string;
		timestamp: string;
	};

	let connected = false;
	let wsConnected = false;
	let room: string | undefined;
	let message = '';
	let username = '';
	let messages: Message[] = [];

	onMount(() => {
		ws.on('connect', () => {
			console.log('connected');
			wsConnected = true;
		});

		ws.on('pong', () => {
			console.log('pong');
		});

		ws.on('message', (data) => {
			console.log('received message', data);
			messages = [...messages, data];
		});

		ws.on('joined', (data) => {
			console.log(data);
			connected = true;
		});

		ws.on('connect_error', () => (wsConnected = false));
		ws.on('connect_failed', () => (wsConnected = false));
		ws.on('disconnect', () => (wsConnected = false));
	});

	const joinRoom = () => {
		connected = true;
		ws.emit('join', { room, user: username });
	};

	const leaveRoom = () => {
		connected = false;
		ws.emit('leave', { room, user: username });
	};

	const sendMessage = () => {
		ws.emit('to', {
			room: room,
			msg: {
				user: username,
				message,
				timestamp: new Date()
			}
		});
		message = '';
	};

	const scrollToBottom = (node: any, p0?: any[]) => {
		const scroll = () =>
			node.scroll({
				top: node.scrollHeight,
				behavior: 'smooth'
			});
		scroll();

		return { update: scroll };
	};

	onDestroy(() => {
		ws.close();
	});
</script>

{#if connected}
	<div class="flex flex-row">
		<span class="flex flex-row">
			<p class="text-left text-lg font-semibold">Room: {room}</p>
			<span class={`ms-1 flex h-3 w-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}
			></span>
		</span>
		<Button
			variant="ghost"
			size="icon"
			class="ml-auto rounded-full hover:bg-red-500 hover:text-white"
			on:click={leaveRoom}
		>
			<Unplug />
		</Button>
	</div>
	<div class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
		<div class="max-h-[70vh] min-h-[70vh] flex-1 overflow-auto" use:scrollToBottom={messages}>
			{#each messages as { user, message, timestamp }}
				{#if user === username}
					<div class="flex flex-col items-start justify-center">
						<p class="text-sm text-muted-foreground">
							{new Date(timestamp).toLocaleTimeString()} - {user}
						</p>
						<div class="mb-2 flex items-center gap-4 rounded-lg bg-green-300 p-4 md:w-[40%]">
							<div class="grid gap-1">
								<p class="text-sm font-medium leading-none">{message}</p>
							</div>
						</div>
					</div>
				{:else if user === 'system'}
					<div class="my-5 flex flex-col items-end justify-center">
						<div class="mb-2 flex items-center justify-end gap-4 rounded-lg md:w-[40%]">
							<div class="grid gap-1">
								<p class="text-sm font-medium leading-none text-muted-foreground">
									{message}
									<small class=" text-sm not-italic text-muted-foreground">
										- {new Date(timestamp).toLocaleTimeString()}</small
									>
								</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-end justify-center">
						<p class="text-sm text-muted-foreground">
							{user} - {new Date(timestamp).toLocaleTimeString()}
						</p>
						<div class="mb-2 flex items-center gap-4 rounded-lg bg-indigo-300 p-4 md:w-[40%]">
							<div class="grid gap-1">
								<p class="text-sm font-medium leading-none">{message}</p>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<form
			on:submit={sendMessage}
			class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
			data-x-chunk-name="dashboard-03-chunk-1"
			data-x-chunk-description="A form for sending a message to an AI chatbot. The form has a textarea and buttons to upload files and record audio."
		>
			<Label for="message" class="sr-only">Message</Label>
			<Textarea
				on:keydown={(e) => {
					e.key === 'Enter' && (e.preventDefault(), sendMessage());
				}}
				bind:value={message}
				id="message"
				placeholder="Type your message here..."
				class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
			/>
			<div class="flex items-center p-3 pt-0">
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button variant="ghost" size="icon" builders={[builder]}>
							<Paperclip class="size-4" />
							<span class="sr-only">Attach file</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top">Attach File</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button variant="ghost" size="icon" builders={[builder]}>
							<Mic class="size-4" />
							<span class="sr-only">Use Microphone</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top">Use Microphone</Tooltip.Content>
				</Tooltip.Root>
				<Button type="submit" size="sm" class="ml-auto gap-1.5">
					Send Message
					<CornerDownLeft class="size-3.5" />
				</Button>
			</div>
		</form>
	</div>
{:else}
	<div class="mt-10 flex w-full flex-row justify-center">
		<form on:submit={joinRoom}>
			<Card.Root class="w-[350px]">
				<Card.Header>
					<Card.Title>Live Chat</Card.Title>
					<Card.Description>Join a chatroom</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col items-start justify-center gap-2">
					<Label for="username">Username</Label>
					<Input id="username" required placeholder="Enter a username" bind:value={username} />
					<Label for="room">Room</Label>
					<Input id="room" required placeholder="Join a room" bind:value={room} />
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button type="submit" class="w-full">Join</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	</div>
{/if}

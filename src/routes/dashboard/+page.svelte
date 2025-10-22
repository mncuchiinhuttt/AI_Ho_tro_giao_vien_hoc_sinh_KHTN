<script lang="ts">
	import { DashboardNavbar } from '$lib/components/layout';
	import { Button } from '$lib/components/ui/button';
	import UploadCloudIcon from '@lucide/svelte/icons/upload-cloud';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Root as InputGroup, InputGroupInput, InputGroupButton } from '$lib/components/ui/input-group';
	import { toast } from 'svelte-sonner';
	import type { PageServerData } from './$types';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from '$lib/components/ui/select';
	import SelectLabel from '$lib/components/ui/select/select-label.svelte';

	const MAX_FILES = 10;
	const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

	let { data }: { data: PageServerData } = $props();
	let files = $state<File[]>([]);
	let dragActive = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let dragDepth = 0;
	let submissionState = $state<'idle' | 'creating' | 'complete'>('idle');
	let lessonLink = $state('');
	let selectedModel = $state<string>('');

	const formatFileSize = (size: number) => {
		const units = ['B', 'KB', 'MB', 'GB'];
		let value = size;
		let unitIndex = 0;

		while (value >= 1024 && unitIndex < units.length - 1) {
			value /= 1024;
			unitIndex += 1;
		}

		const display = value >= 10 || unitIndex === 0 ? Math.round(value) : parseFloat(value.toFixed(1));
		return `${display} ${units[unitIndex]}`;
	};

	function isAllowedFile(file: File) {
		const type = file.type?.toLowerCase() ?? '';
		if (type === 'application/pdf') return true;
		if (type.startsWith('image/')) return true;

		const name = file.name.toLowerCase();
		return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
	}

	function addFiles(fileList: FileList | File[]) {
		if (submissionState === 'complete') return;
		const existing = [...files];
		let rejected = false;
		const eligible = Array.from(fileList).filter((file) => {
			if (!isAllowedFile(file)) {
				rejected = true;
				return false;
			}
			return !existing.some(
				(current) =>
					current.name === file.name &&
					current.size === file.size &&
					current.lastModified === file.lastModified
			);
		});

		if (eligible.length === 0) {
			if (rejected) {
				toast.warning('Only PDF documents and image files are supported.');
			}
			return;
		}

		const availableSlots = Math.max(0, MAX_FILES - existing.length);
		const filesToAdd = eligible.slice(0, availableSlots);

		if (filesToAdd.length === 0) {
			toast.warning(`You can upload up to ${MAX_FILES} files.`);
			if (rejected) {
				toast.warning('Only PDF documents and image files are supported.');
			}
			return;
		}

		files = [...existing, ...filesToAdd];
		if (eligible.length > filesToAdd.length) {
			toast.warning(`Only the first ${MAX_FILES} files were added.`);
		}
		if (rejected) {
			toast.warning('Only PDF documents and image files are supported.');
		}
	}

	function handleFileChange(event: Event) {
		if (submissionState === 'complete') return;
		const target = event.currentTarget as HTMLInputElement;
		if (!target.files) return;
		addFiles(target.files);
		target.value = '';
	}

	function handleDragEnter(event: DragEvent) {
		if (submissionState === 'complete') return;
		if (!event.dataTransfer?.types?.includes('Files')) return;
		event.preventDefault();
		dragDepth += 1;
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		if (submissionState === 'complete') return;
		if (!event.dataTransfer?.types?.includes('Files')) return;
		event.preventDefault();
		dragDepth = Math.max(dragDepth - 1, 0);
		if (dragDepth === 0) {
			dragActive = false;
		}
	}

	function handleDragOver(event: DragEvent) {
		if (submissionState === 'complete') return;
		if (!event.dataTransfer?.types?.includes('Files')) return;
		event.preventDefault();
	}

	function handleDrop(event: DragEvent) {
		if (submissionState === 'complete') return;
		if (!event.dataTransfer?.files?.length) return;
		event.preventDefault();
		dragDepth = 0;
		dragActive = false;
		addFiles(event.dataTransfer.files);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (submissionState === 'complete') return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			fileInput?.click();
		}
	}

	function removeFile(target: File) {
		files = files.filter((file) => file !== target);
	}

	function clearAll() {
		files = [];
	}

	function handleClearAllClick(event: MouseEvent) {
		if (submissionState === 'complete') return;
		event.stopPropagation();
		clearAll();
	}

	function handleRemoveFileClick(event: MouseEvent, target: File) {
		if (submissionState === 'complete') return;
		removeFile(target);
	}

	const handleCreateSubmit: SubmitFunction = ({ formData, cancel }) => {
		if (files.length === 0 || submissionState === 'creating') {
			cancel();
			return;
		}

		files.forEach((file) => formData.append('files', file));
		formData.append('model', selectedModel);

		submissionState = 'creating';

		return async ({ result }) => {
			if (result.type === 'success' && result.data?.success && result.data.lessonId) {
				lessonLink = `${window.location.origin}/${result.data.lessonId}`;
				submissionState = 'complete';
				files = [];
				dragActive = false;
				toast.success('Lesson created successfully');
			} else {
				submissionState = 'idle';
				toast.error('AI service is currently unavailable or failed to generate content. Please try again later.');
			}
		};
	};

	function resetUploader() {
		submissionState = 'idle';
		lessonLink = '';
	}
</script>

<svelte:head>
	<title>Dashboard • Science Bridge AI</title>
</svelte:head>

<main class="min-h-screen bg-slate-950 text-slate-100">
	<DashboardNavbar
		appName="Science Bridge AI"
		user={{ id: data.user.id, username: data.user.username }}
	/>

	<section class="mx-auto w-full max-w-5xl px-6 py-12">
		<h1 class="text-3xl font-semibold tracking-tight">Welcome back, {data.user.username}!</h1>
		<p class="mt-3 text-base text-slate-300">
			Your user ID is <span class="font-mono text-slate-100">{data.user.id}</span>.
		</p>

		<div class="mt-6 flex items-center gap-3">
			<label for="model-select" class="text-sm font-medium text-slate-300">AI Model:</label>
			<Select type="single" bind:value={selectedModel} disabled={submissionState === 'creating'}>
				<SelectTrigger id="model-select" class="w-64 bg-slate-900/60 border-white/10">
					{#if selectedModel === 'gemini-flash-latest'}
						Gemini Flash
					{:else if selectedModel === 'gemini-2.5-pro'}
						Gemini 2.5 Pro
					{:else}
						Select a model
					{/if}
				</SelectTrigger>
				<SelectContent>
					<SelectLabel>Select a model</SelectLabel>
					<SelectItem value="gemini-flash-latest">Gemini Flash</SelectItem>
					<SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="mt-10">
			{#if submissionState === 'complete'}
				<div
					class="rounded-xl border border-emerald-400 bg-emerald-500/10 p-8 text-slate-200 shadow-lg"
				>
					<div class="space-y-6 text-center">
						<div class="space-y-2">
							<h2 class="text-2xl font-semibold text-slate-100">Lesson ready!</h2>
							<p class="text-sm text-slate-300">
								Share the link below with your students to get started.
							</p>
						</div>
						<InputGroup class="bg-slate-900/70">
							<InputGroupInput readonly value={lessonLink} class="bg-transparent text-slate-100" />
							<InputGroupButton
								type="button"
								class="text-sm font-semibold mr-2"
								onclick={() => {
									navigator.clipboard.writeText(lessonLink);
									toast.success('Link copied to clipboard');
								}}
							>
								Copy link
							</InputGroupButton>
						</InputGroup>
						<Button 
                            class="w-full text-black bg-slate-100 hover:bg-slate-300"
                            onclick={resetUploader}
                        >
							Create another lesson
						</Button>
					</div>
				</div>
			{:else}
				<div
					class={`rounded-xl border p-8 text-slate-200 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${dragActive ? 'border-sky-400 bg-sky-500/20 shadow-xl' : files.length ? 'border-white/15 bg-slate-900/40' : 'border-dashed border-white/15 bg-white/5 hover:border-white/30'}`}
					ondragenter={handleDragEnter}
					ondragleave={handleDragLeave}
					ondragover={handleDragOver}
					ondrop={handleDrop}
					onclick={() => fileInput?.click()}
					onkeydown={handleKeyDown}
					role="button"
					tabindex="0"
					aria-label="Upload files"
					aria-describedby="upload-help"
				>
					<input
						type="file"
						multiple
						accept=".pdf,image/*"
						class="hidden"
						bind:this={fileInput}
						onchange={handleFileChange}
					/>
					{#if files.length === 0}
						<div
							class="flex flex-col items-center justify-center gap-4 text-center text-slate-300"
						>
							<UploadCloudIcon class="size-12 text-sky-300" aria-hidden="true" />
							<div class="space-y-2">
								<p class="text-lg font-medium text-slate-100">Drag and drop files</p>
								<p id="upload-help" class="text-sm text-slate-400">
									Drop files here or click to browse. You can add up to {MAX_FILES} files. Just
									PDFs and images are allowed.
								</p>
							</div>
						</div>
					{:else}
						<div class="space-y-4">
							<header class="flex flex-wrap items-center justify-between gap-3">
								<div>
									<p class="text-lg font-semibold text-slate-100">Files selected</p>
									<p id="upload-help" class="text-sm text-slate-400">
										{files.length} of {MAX_FILES} files ready.
									</p>
								</div>
								<button
									type="button"
									class="text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-200"
									onclick={handleClearAllClick}
								>
									Clear all
								</button>
							</header>
							<ul class="grid gap-3" role="list">
								{#each files as file (file.name + file.size + file.lastModified)}
									<li
										class="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
									>
										<div class="space-y-1">
											<p class="font-medium text-slate-100">{file.name}</p>
											<p class="text-xs text-slate-400">{formatFileSize(file.size)}</p>
										</div>
										<button
											type="button"
											class="text-xs font-medium text-rose-300 hover:text-rose-200"
											onclick={(event) => handleRemoveFileClick(event, file)}
										>
											Remove
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		{#if submissionState !== 'complete'}
			<form
				method="post"
				action="?/create"
				class="mt-6"
				enctype="multipart/form-data"
				use:enhance={handleCreateSubmit}
			>
				<Button
					type="submit"
					size="lg"
					disabled={files.length === 0 || submissionState === 'creating'}
                    class="w-full text-black bg-slate-100 hover:bg-slate-300"
				>
					{submissionState === 'creating' ? 'Creating…' : 'Create lesson'}
				</Button>
			</form>
		{/if}

		<!-- Lesson History Section -->
		<div class="mt-16">
			<h2 class="text-2xl font-semibold tracking-tight">Your Lessons</h2>
			<p class="mt-2 text-sm text-slate-400">
				View and access all lessons you've created.
			</p>

			{#if data.lessons && data.lessons.length > 0}
				<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.lessons as lesson}
						<div
							class="group rounded-xl border border-white/10 bg-slate-900/40 p-6 transition-all hover:border-white/20 hover:bg-slate-900/60 hover:shadow-lg flex flex-col"
						>
							<div class="flex-1 space-y-2">
								<h3 class="text-lg font-semibold text-slate-100 line-clamp-2">
									{lesson.title}
								</h3>
								<p class="text-xs text-slate-400">
									Created {new Date(lesson.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</p>
							</div>
							<a
								href="/{lesson.id}"
								class="mt-4 inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 w-full"
							>
								Open lesson
							</a>
						</div>
					{/each}
				</div>
			{:else}
				<div class="mt-6 rounded-xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
					<p class="text-sm text-slate-400">
						No lessons yet. Create your first lesson above to get started!
					</p>
				</div>
			{/if}
		</div>
	</section>
</main>

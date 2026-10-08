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
	let selectedModel = $state<string>('gemini-3.8-flash');
	let numberOfPeriods = $state<number>(1);

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
		formData.append('numberOfPeriods', numberOfPeriods.toString());

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
		numberOfPeriods = 1;
	}
</script>

<svelte:head>
	<title>Dashboard • Science Bridge AI</title>
</svelte:head>

<main class="min-h-screen bg-white">
	<DashboardNavbar
		appName="Science Bridge AI"
		user={{ id: data.user.id, username: data.user.username }}
	/>

	<section class="mx-auto w-full max-w-6xl px-6 py-12">
		<div class="mb-12">
			<h1 class="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">
				Welcome back, {data.user.username}!
			</h1>
			<p class="mt-3 text-base text-gray-600">
				Ready to create amazing learning experiences? Let's get started.
			</p>
		</div>

		<div class="mb-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-lg border border-teal-100">
			<div class="grid gap-6 md:grid-cols-2">
				<!-- AI Model Selection -->
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 text-white shadow-md flex-shrink-0">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
						</svg>
					</div>
					<div class="flex-1">
						<label for="model-select" class="text-sm font-semibold text-gray-700 block mb-2">
							Choose AI Model
						</label>
						<Select type="single" bind:value={selectedModel} disabled={submissionState === 'creating'}>
							<SelectTrigger id="model-select" class="w-full bg-white border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-teal-300">
								{#if selectedModel === 'gemini-3.8-flash'}
									⚡ Gemini 3.8 Flash (mnRouter)
								{:else}
									Select your AI model
								{/if}
							</SelectTrigger>
							<SelectContent>
								<SelectLabel>Available Models</SelectLabel>
								<SelectItem value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Recommended)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<!-- Number of Periods Input -->
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 text-white shadow-md flex-shrink-0">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
					</div>
					<div class="flex-1">
						<label for="periods-input" class="text-sm font-semibold text-gray-700 block mb-2">
							Number of Periods
						</label>
						<input
							id="periods-input"
							type="number"
							min="1"
							max="10"
							bind:value={numberOfPeriods}
							disabled={submissionState === 'creating'}
							class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-teal-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="e.g., 2"
						/>
						<p class="mt-1 text-xs text-gray-500">Each period = 45 minutes</p>
					</div>
				</div>
			</div>
		</div>

		<div>
			{#if submissionState === 'complete'}
				<div
					class="rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 p-10 shadow-xl"
				>
					<div class="space-y-6 text-center">
						<div class="flex justify-center">
							<div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-white">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
								</svg>
							</div>
						</div>
						<div class="space-y-2">
							<h2 class="text-3xl font-bold text-gray-900">Lesson Created Successfully! 🎉</h2>
							<p class="text-base text-gray-700">
								Your lesson is ready to share. Copy the link below and send it to your students.
							</p>
						</div>
						<InputGroup class="bg-white shadow-sm border border-gray-200">
							<InputGroupInput readonly value={lessonLink} class="bg-transparent text-gray-900 font-mono text-sm" />
							<InputGroupButton
								type="button"
								class="text-sm font-semibold mr-2 bg-teal-500 text-white hover:bg-teal-600"
								onclick={() => {
									navigator.clipboard.writeText(lessonLink);
									toast.success('Link copied to clipboard');
								}}
							>
								📋 Copy
							</InputGroupButton>
						</InputGroup>
						<Button 
                            class="w-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500 shadow-md font-semibold py-6 text-base"
                            onclick={resetUploader}
                        >
							✨ Create Another Lesson
						</Button>
					</div>
				</div>
			{:else}
				<div
					class={`rounded-2xl border-2 p-10 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 ${dragActive ? 'border-teal-400 bg-teal-50 shadow-2xl scale-[1.02]' : files.length ? 'border-gray-200 bg-gray-50' : 'border-dashed border-gray-300 bg-white hover:border-teal-300 hover:shadow-xl'}`}
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
							class="flex flex-col items-center justify-center gap-6 text-center"
						>
							<div class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100">
								<UploadCloudIcon class="size-12 text-teal-500" aria-hidden="true" />
							</div>
							<div class="space-y-3">
								<p class="text-xl font-bold text-gray-900">Drop your files here</p>
								<p id="upload-help" class="text-base text-gray-600 max-w-md mx-auto">
									Drag and drop your PDF documents or images, or click to browse. 
									<span class="block mt-1 text-sm text-gray-500">
										Up to {MAX_FILES} files • PDF, PNG, JPG, JPEG, GIF, WEBP
									</span>
								</p>
								<div class="pt-2">
									<span class="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
										</svg>
										Click to browse files
									</span>
								</div>
							</div>
						</div>
					{:else}
						<div class="space-y-5">
							<header class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
								<div>
									<p class="text-xl font-bold text-gray-900">Files Ready</p>
									<p id="upload-help" class="text-sm text-gray-600 mt-1">
										{files.length} of {MAX_FILES} files selected
									</p>
								</div>
								<button
									type="button"
									class="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
									onclick={handleClearAllClick}
								>
									🗑️ Clear all
								</button>
							</header>
							<ul class="grid gap-3 max-h-80 overflow-y-auto pr-2" role="list">
								{#each files as file (file.name + file.size + file.lastModified)}
									<li
										class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm shadow-sm hover:shadow-md transition-all"
									>
										<div class="flex items-center gap-4 flex-1 min-w-0">
											<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100 flex-shrink-0">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-teal-500">
													<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
												</svg>
											</div>
											<div class="space-y-1 min-w-0 flex-1">
												<p class="font-semibold text-gray-900 truncate">{file.name}</p>
												<p class="text-xs text-gray-500">{formatFileSize(file.size)}</p>
											</div>
										</div>
										<button
											type="button"
											class="ml-3 flex-shrink-0 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
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
				class="mt-8"
				enctype="multipart/form-data"
				use:enhance={handleCreateSubmit}
			>
				<Button
					type="submit"
					size="lg"
					disabled={files.length === 0 || submissionState === 'creating' || !selectedModel}
                    class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all font-bold text-lg py-7 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if submissionState === 'creating'}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Creating your lesson...
					{:else}
						Create Lesson with AI
					{/if}
				</Button>
				{#if !selectedModel && files.length > 0}
					<p class="mt-3 text-sm text-amber-700 text-center bg-amber-50 border border-amber-200 rounded-lg py-2 px-4">
						⚠️ Please select an AI model before creating your lesson
					</p>
				{/if}
			</form>
		{/if}

		<!-- Lesson History Section -->
		<div class="mt-20">
			<div class="mb-8">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900">Your Lessons</h2>
				<p class="mt-2 text-base text-gray-600">
					Browse and manage all the lessons you've created
				</p>
			</div>

			{#if data.lessons && data.lessons.length > 0}
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.lessons as lesson}
						<div
							class="group rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-teal-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col"
						>
							<div class="flex-1 space-y-3">
								<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 shadow-md group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
									</svg>
								</div>
								<h3 class="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
									{lesson.title}
								</h3>
								<div class="flex items-center gap-2 text-sm text-gray-500">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
									</svg>
									{new Date(lesson.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</div>
							</div>
							<a
								href="/{lesson.id}"
								class="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white transition-all hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 w-full group-hover:scale-105"
							>
								<span>Open Lesson</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
								</svg>
							</a>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-teal-50 p-16 text-center">
					<div class="flex justify-center mb-6">
						<div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-teal-500">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
							</svg>
						</div>
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">No lessons yet</h3>
					<p class="text-base text-gray-600">
						Create your first AI-powered lesson above to get started! 🚀
					</p>
				</div>
			{/if}
		</div>
	</section>
</main>

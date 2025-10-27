<script lang="ts">
	import DashboardNavbar from '$lib/components/layout/dashboard-navbar.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import {
		Carousel,
		CarouselContent,
		CarouselItem,
		CarouselNext,
		CarouselPrevious
	} from '$lib/components/ui/carousel';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { markdownToDocxBlob } from '$lib';

	let { data }: { data: PageData } = $props();
	let lesson = data.lesson;
	const vocabulary = lesson.vocabulary ?? [];
	const revealed = $state<Record<string, boolean>>({});
	const audioCache = $state<Record<string, string>>({});

	const triggerDownload = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};

	async function handleLessonPlanDownload() {
		const blob = await markdownToDocxBlob(lesson.lessonContent);
		triggerDownload(blob, `${lesson.title.replace(/\s+/g, '_')}_Lesson_Plan.docx`);
	}

	async function handleStudyDocDownload() {
		const blob = await markdownToDocxBlob(lesson.studyContent);
		triggerDownload(blob, `${lesson.title.replace(/\s+/g, '_')}_Study_Document.docx`);
	}

	const play = async (text: string) => {
		if (!text) return;

		try {
			let audioUrl = audioCache[text];
			if (!audioUrl) {
				const response = await fetch('/api/tts', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ word: text })
				});

				if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);

				const blob = await response.blob();
				audioUrl = URL.createObjectURL(blob);
				audioCache[text] = audioUrl;
			}

			const audio = new Audio(audioUrl);
			await audio.play();
		} catch (error) {
			console.error('Unable to play word audio', error);
		}
	};

	onDestroy(() => {
		for (const url of Object.values(audioCache)) {
			URL.revokeObjectURL(url);
		}
	});

	const toggleCard = (key: string) => {
		revealed[key] = !revealed[key];
	};
</script>

<svelte:head>
	<title>{lesson.title} • Science Bridge AI</title>
</svelte:head>

<main class="relative min-h-screen overflow-hidden bg-white text-gray-900">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-teal-50/30 via-white to-cyan-50/30"
		aria-hidden="true"
	></div>

	<DashboardNavbar user={data.user} />

	<section class="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
		<Card class="border-2 border-gray-200 bg-white shadow-2xl">
			<CardHeader class="space-y-3">
				<CardTitle class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">{lesson.title}</CardTitle>
				<CardDescription class="text-base text-gray-600">
                    This lesson page is ready to use.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="grid gap-4 rounded-lg border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 text-sm text-gray-700 sm:grid-cols-2">
					<div>
						<p class="text-xs uppercase tracking-wide text-teal-600 font-semibold">Lesson code</p>
						<p class="mt-1 text-lg font-bold text-gray-900">{data.lessonId}</p>
					</div>
					<div>
						<p class="text-xs uppercase tracking-wide text-teal-600 font-semibold">Access</p>
						<p class="mt-1 leading-relaxed text-gray-800">
							{#if data.isAuthor}
								You are viewing this page as author (<span class="font-semibold text-teal-600">@{data.user?.username}</span>).
							{:else}
                                You are viewing this page as guest.
							{/if}
						</p>
					</div>
				</div>

                {#if data.isAuthor}
					<div class="space-y-3 rounded-lg border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 text-sm">
						<div class="space-y-1">
							<p class="text-xs uppercase tracking-wide text-teal-600 font-semibold">Author tools</p>
							<p class="text-base font-bold text-gray-900">Lesson plan download</p>
						</div>
						<p class="text-sm leading-relaxed text-gray-700">
							Download the markdown lesson plan to refine content offline.
						</p>
						<Button onclick={handleLessonPlanDownload} class="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-md font-semibold">
							Download lesson plan
						</Button>
					</div>
				{/if}

				<div class="space-y-3 rounded-lg border-2 border-gray-200 bg-white p-6 text-sm shadow-md">
					<div class="space-y-1">
						<p class="text-xs uppercase tracking-wide text-teal-600 font-semibold">Lesson resources</p>
						<p class="text-base font-bold text-gray-900">Study document</p>
					</div>
					<p class="text-sm leading-relaxed text-gray-700">
						Get the study materials prepared for this lesson.
					</p>
					<Button onclick={handleStudyDocDownload} class="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-md font-semibold">
						Download study document
					</Button>
				</div>

				<div class="space-y-4 rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-teal-50 p-6 shadow-md">
					<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p class="text-xs uppercase tracking-wide text-teal-600 font-semibold">Vocabulary deck</p>
							<h3 class="text-xl font-bold text-gray-900">Flashcards</h3>
							<p class="text-sm text-gray-600">
								Tap a card to reveal its meaning. Tap again to flip it back.
							</p>
						</div>
					</div>

					{#if vocabulary.length > 0}
						<div class="relative">
							<Carousel class="md:px-2 md:mx-10">
								<CarouselContent class="py-4">
									{#each vocabulary as item, index}
										{#key `${index}-${item.word}`}
											<CarouselItem class="basis-full sm:basis-3/4">
												<div
													class="mx-auto h-64 w-full max-w-md cursor-pointer [perspective:1000px]"
													role="button"
													tabindex="0"
													onclick={() => toggleCard(`${index}-${item.word}`)}
													onkeydown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															toggleCard(`${index}-${item.word}`);
														}
													}}
												>
													<div
														class={`relative h-full w-full rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50 p-6 shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${revealed[`${index}-${item.word}`] ? '[transform:rotateY(180deg)]' : ''}`}
													>
														<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center [backface-visibility:hidden]">
															<button
																type="button"
																class="absolute right-4 top-4 rounded-full border-2 border-teal-400 bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white transition hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
																title={`Play ${item.word}`}
																aria-label={`Play pronunciation for ${item.word}`}
																onclick={(event) => {
																	event.stopPropagation();
																	void play(item.word);
																}}
																onkeydown={(event) => {
																	event.stopPropagation();
																}}
															>
																Play
															</button>
															<p class="text-lg font-bold text-gray-900">{item.word}</p>
															<p class="text-sm text-teal-600">{item.ipa}</p>
															<span class="mt-4 rounded-full border-2 border-teal-300 bg-teal-100 px-3 py-1 text-xs uppercase tracking-wide text-teal-700 font-semibold">
																Reveal meaning
															</span>
														</div>
														<div class="absolute inset-0 flex flex-col justify-start gap-3 overflow-y-auto rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-6 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
															<p class="text-xs font-bold uppercase tracking-wide text-teal-100">English meaning</p>
															<p class="text-base font-semibold">{item.english}</p>
															<p class="text-xs font-bold uppercase tracking-wide text-teal-100">Vietnamese meaning</p>
															<p class="text-base font-semibold">{item.vietnamese}</p>
														</div>
													</div>
												</div>
											</CarouselItem>
										{/key}
									{/each}
								</CarouselContent>
								{#if vocabulary.length > 1}
									<!-- Desktop: Side arrows -->
									<CarouselPrevious class="hidden sm:flex bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 border-2 border-teal-300" />
									<CarouselNext class="hidden sm:flex bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 border-2 border-teal-300" />
								{/if}

								{#if vocabulary.length > 1}
									<!-- Mobile: Bottom arrows -->
									<div class="flex sm:hidden justify-center gap-4 mt-4">
										<CarouselPrevious class="static transform-none bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 border-2 border-teal-300" />
										<CarouselNext class="static transform-none bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 border-2 border-teal-300" />
									</div>
								{/if}
							</Carousel>
							
						</div>
					{:else}
						<div class="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-center text-sm text-gray-500 shadow-sm">
							<p class="font-semibold">No vocabulary has been added for this lesson yet.</p>
							<p>Add words to unlock interactive flashcards.</p>
						</div>
					{/if}
				</div>
			</CardContent>
		</Card>
	</section>
</main>

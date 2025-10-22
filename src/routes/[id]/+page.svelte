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

<main class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.3),_rgba(15,23,42,0)_55%),_radial-gradient(circle_at_bottom,_rgba(124,58,237,0.25),_rgba(15,23,42,0)_55%)]"
		aria-hidden="true"
	></div>

	<DashboardNavbar user={data.user} />

	<section class="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
		<Card class="border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
			<CardHeader class="space-y-3">
				<CardTitle class="text-3xl font-semibold text-white">{lesson.title}</CardTitle>
				<CardDescription class="text-base text-slate-300">
                    This lesson page is ready to use.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="grid gap-4 rounded-lg border border-white/10 bg-black/30 p-6 text-sm text-slate-200 sm:grid-cols-2">
					<div>
						<p class="text-xs uppercase tracking-wide text-slate-400">Lesson code</p>
						<p class="mt-1 text-lg font-medium text-white">{data.lessonId}</p>
					</div>
					<div>
						<p class="text-xs uppercase tracking-wide text-slate-400">Access</p>
						<p class="mt-1 leading-relaxed">
							{#if data.isAuthor}
								You are viewing this page as author (<span class="font-semibold">@{data.user?.username}</span>).
							{:else}
                                You are viewing this page as guest.
							{/if}
						</p>
					</div>
				</div>

                {#if data.isAuthor}
					<div class="space-y-3 rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
						<div class="space-y-1">
							<p class="text-xs uppercase tracking-wide text-slate-400">Author tools</p>
							<p class="text-base font-medium text-white">Lesson plan download</p>
						</div>
						<p class="text-sm leading-relaxed text-slate-300">
							Download the markdown lesson plan to refine content offline.
						</p>
						<Button onclick={handleLessonPlanDownload} class="w-full sm:w-auto">
							Download lesson plan
						</Button>
					</div>
				{/if}

				<div class="space-y-3 rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
					<div class="space-y-1">
						<p class="text-xs uppercase tracking-wide text-slate-400">Lesson resources</p>
						<p class="text-base font-medium text-white">Study document</p>
					</div>
					<p class="text-sm leading-relaxed text-slate-300">
						Get the study materials prepared for this lesson.
					</p>
					<Button onclick={handleStudyDocDownload} variant="secondary" class="w-full sm:w-auto">
						Download study document
					</Button>
				</div>

				<div class="space-y-4 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-200">
					<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-400">Vocabulary deck</p>
							<h3 class="text-xl font-semibold text-white">Flashcards</h3>
							<p class="text-sm text-slate-400">
								Tap a card to reveal its meaning. Tap again to flip it back.
							</p>
						</div>
					</div>

					{#if vocabulary.length > 0}
						<div class="relative">
							<Carousel class="px-2 ml-20 mr-20">
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
														class={`relative h-full w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${revealed[`${index}-${item.word}`] ? '[transform:rotateY(180deg)]' : ''}`}
													>
														<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center [backface-visibility:hidden]">
															<button
																type="button"
																class="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-slate-200/60"
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
															<p class="text-lg font-semibold text-white">{item.word}</p>
															<p class="text-sm text-slate-300">{item.ipa}</p>
															<span class="mt-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
																Reveal meaning
															</span>
														</div>
														<div class="absolute inset-0 flex flex-col justify-center gap-3 rounded-2xl bg-white/90 p-6 text-slate-900 [backface-visibility:hidden] [transform:rotateY(180deg)]">
															<p class="text-xs font-medium uppercase tracking-wide text-slate-500">English meaning</p>
															<p class="text-base font-semibold">{item.english}</p>
															<p class="text-xs font-medium uppercase tracking-wide text-slate-500">Vietnamese meaning</p>
															<p class="text-base font-semibold text-slate-800">{item.vietnamese}</p>
														</div>
													</div>
												</div>
											</CarouselItem>
										{/key}
									{/each}
								</CarouselContent>
								{#if vocabulary.length > 1}
									<CarouselPrevious class="hidden sm:flex text-black" />
									<CarouselNext class="hidden sm:flex text-black" />
								{/if}
							</Carousel>
						</div>
					{:else}
						<div class="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/40 text-center text-sm text-slate-400">
							<p>No vocabulary has been added for this lesson yet.</p>
							<p>Add words to unlock interactive flashcards.</p>
						</div>
					{/if}
				</div>
			</CardContent>
		</Card>
	</section>
</main>

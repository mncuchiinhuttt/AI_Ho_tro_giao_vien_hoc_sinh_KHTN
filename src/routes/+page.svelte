<script lang="ts">
	import { DashboardNavbar } from '$lib/components/layout';
	import { Button } from '$lib/components/ui/button';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Science Bridge AI • Trợ lý KHTN Song Ngữ</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-white">
	<!-- Ambient Background Glow -->
	<div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
		<div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/10 to-indigo-500/20 blur-[130px] rounded-full"></div>
		<div class="absolute bottom-0 right-10 w-[500px] h-[300px] bg-gradient-to-tl from-cyan-600/10 to-purple-600/10 blur-[120px] rounded-full"></div>
	</div>

	<!-- Top Navigation -->
	<header class="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
		<div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
					<span class="text-slate-950 font-black text-lg">🔬</span>
				</div>
				<span class="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
					Science Bridge AI
				</span>
			</a>

			<nav class="flex items-center gap-4">
				{#if data.user}
					<a href="/dashboard">
						<Button class="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/20">
							Bảng điều khiển
						</Button>
					</a>
				{:else}
					<a href="/login" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">
						Đăng nhập
					</a>
					<a href="/login">
						<Button class="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/20">
							Bắt đầu ngay
						</Button>
					</a>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold mb-8 backdrop-blur-sm">
			<span class="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
			Chuyên biệt cho môn Khoa học Tự nhiên (CLIL)
		</div>

		<h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-8">
			Dạy và Học KHTN Song Ngữ <br />
			<span class="bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
				Đơn giản & Chuẩn mực cùng AI
			</span>
		</h1>

		<p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
			Chuyển hóa tài liệu sách giáo khoa, giáo trình tiếng Việt thành giáo án tiếng Anh, tóm tắt bài học và bộ từ vựng kèm phát âm IPA chuẩn xác chỉ trong vài giây.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a href={data.user ? '/dashboard' : '/login'}>
				<Button size="lg" class="h-13 px-8 text-base bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold shadow-xl shadow-teal-500/25 transition-all">
					{data.user ? 'Đến Bảng Điều Khiển →' : 'Trải nghiệm ngay miễn phí →'}
				</Button>
			</a>
			<a href="#features">
				<Button size="lg" variant="outline" class="h-13 px-8 text-base border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium">
					Xem tính năng
				</Button>
			</a>
		</div>
	</section>

	<!-- Core Features Bento Grid -->
	<section id="features" class="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
		<div class="text-center mb-16">
			<h2 class="text-3xl font-bold tracking-tight text-white mb-4">Mọi công cụ hỗ trợ tiết dạy song ngữ</h2>
			<p class="text-slate-400 max-w-xl mx-auto">Thiết kế tối ưu cho giáo viên KHTN THCS & THPT theo chương trình GDPT mới.</p>
		</div>

		<div class="grid md:grid-cols-3 gap-6">
			<div class="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 transition-colors backdrop-blur-sm">
				<div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-2xl mb-6">
					📋
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Giáo Án CLIL Chuẩn</h3>
				<p class="text-slate-400 text-sm leading-relaxed">
					Tự động tạo giáo án tiếng Anh chi tiết chia theo số tiết học, cấu trúc hoạt động học tập rõ ràng, bài tập vận dụng đầy đủ.
				</p>
			</div>

			<div class="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-colors backdrop-blur-sm">
				<div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl mb-6">
					📇
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Thẻ Từ Vựng & Audio IPA</h3>
				<p class="text-slate-400 text-sm leading-relaxed">
					Trích xuất thuật ngữ chuyên ngành Vật lý, Hóa học, Sinh học với phiên âm chuẩn quốc tế và audio giọng đọc tự nhiên.
				</p>
			</div>

			<div class="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-colors backdrop-blur-sm">
				<div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl mb-6">
					📥
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Xuất File Word (.docx)</h3>
				<p class="text-slate-400 text-sm leading-relaxed">
					Tải tài liệu và giáo án về máy tính chỉ với 1 click, giữ nguyên cấu trúc bảng biểu, font chữ và công thức khoa học.
				</p>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-white/10 py-10 text-center text-sm text-slate-500">
		<p>© 2026 Science Bridge AI. Nền tảng hỗ trợ giáo dục Khoa học Tự nhiên song ngữ.</p>
	</footer>
</div>

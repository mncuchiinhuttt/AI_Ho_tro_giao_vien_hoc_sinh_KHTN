<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	// Interactive Translation Demo State
	let selectedSubject = $state('Tin học');
	let selectedStyle = $state('Theo văn phong giáo án');
	let isTranslating = $state(false);
	let copied = $state(false);

	const demoPresets: Record<string, { vi: string; en: string }> = {
		'Tin học': {
			vi: `Mục tiêu bài học:\nHọc sinh hiểu được khái niệm thuật toán và mô tả được các bước giải quyết một bài toán đơn giản.\n\nHoạt động khởi động:\nGiáo viên đặt câu hỏi gợi mở để học sinh liên hệ kiến thức đã học với tình huống thực tế về lập trình thuật toán sắp xếp.`,
			en: `Learning Objectives:\nStudents understand the concept of an algorithm and describe the sequential steps involved in solving a simple computational problem.\n\nWarm-up Activity:\nThe teacher presents guided inquiry questions, encouraging students to connect prior conceptual knowledge with real-world sorting scenarios.`
		},
		'Toán học': {
			vi: `Mục tiêu bài học:\nHọc sinh nắm vững định lý Pythagoras, nhận biết tam giác vuông và tính toán cạnh huyền.\n\nHoạt động nhóm:\nHọc sinh đo đạc mô hình tam giác thực tế và kiểm chứng bằng công thức đại số.`,
			en: `Learning Objectives:\nStudents master the Pythagorean Theorem, identify right-angled triangles, and calculate the hypotenuse accurately.\n\nGroup Activity:\nStudents measure physical triangle models and verify findings using algebraic formulas.`
		},
		'Vật lí': {
			vi: `Mục tiêu bài học:\nHiểu định luật bảo toàn năng lượng, giải thích hiện tượng cơ năng chuyển hóa thành nhiệt năng.\n\nThí nghiệm thực hành:\nQuan sát dao động con lắc đơn và ghi nhận số liệu tiêu hao năng lượng do ma sát.`,
			en: `Learning Objectives:\nUnderstand the law of conservation of energy; explain mechanical energy converting into thermal dissipation.\n\nPractical Lab:\nObserve simple pendulum oscillation and record kinetic data with air resistance factors.`
		},
		'Hóa học': {
			vi: `Mục tiêu bài học:\nPhân biệt phản ứng trao đổi và phản ứng oxi hóa - khử thông qua thí nghiệm dung dịch muối.\n\nThảo luận lớp:\nHọc sinh lập bảng cân bằng phương trình ion thu gọn.`,
			en: `Learning Objectives:\nDistinguish double replacement from redox reactions via aqueous salt experiments.\n\nClass Discussion:\nStudents construct balanced net ionic equations collaboratively.`
		},
		'Sinh học': {
			vi: `Mục tiêu bài học:\nMô tả cấu trúc tế bào thực vật và động vật, so sánh chức năng của lục lạp và ti thể.\n\nHoạt động củng cố:\nVẽ sơ đồ tư duy so sánh quá trình quang hợp và hô hấp tế bào.`,
			en: `Learning Objectives:\nDescribe plant vs animal cellular structure; contrast chloroplast and mitochondria functions.\n\nConsolidation Activity:\nConstruct a comparative mind map between photosynthesis and cellular respiration.`
		}
	};

	let sourceText = $state(demoPresets['Tin học'].vi);
	let resultText = $state(demoPresets['Tin học'].en);

	function handleSubjectChange(sub: string) {
		selectedSubject = sub;
		if (demoPresets[sub]) {
			sourceText = demoPresets[sub].vi;
			resultText = demoPresets[sub].en;
		}
	}

	function handleTranslate() {
		isTranslating = true;
		setTimeout(() => {
			if (demoPresets[selectedSubject]) {
				resultText = demoPresets[selectedSubject].en;
			} else {
				resultText = `Educational Objectives:\nStudents achieve mastery in core concepts and apply interactive methodology systematically.\n\nInstructional Activities:\nEngage in guided collaborative inquiries and verify theoretical hypotheses.`;
			}
			isTranslating = false;
		}, 600);
	}

	function handleCopy() {
		navigator.clipboard.writeText(resultText);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// FAQ Accordion State
	let openFaq = $state<number | null>(0);
	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}

	const faqs = [
		{
			q: 'Công cụ hỗ trợ những định dạng tài liệu nào?',
			a: 'EduTranslate hỗ trợ xử lý trực tiếp tệp PDF, tài liệu Word (.docx), và ảnh chụp trang sách bài tập/giáo án tiếng Việt rõ nét.'
		},
		{
			q: 'Bản dịch có giữ nguyên định dạng giáo án không?',
			a: 'Có. Hệ thống bám sát cấu trúc nguyên bản: phân mục I, II, III, bảng tiến trình 4 bước dạy học (Khởi động, Khám phá, Luyện tập, Vận dụng) và các ký hiệu toán/lý/hóa.'
		},
		{
			q: 'Tôi có thể chỉnh sửa nội dung sau khi dịch không?',
			a: 'Hoàn toàn được. Thầy cô có thể đọc soát trực tiếp trên giao diện, sửa từ ngữ cho hợp đối tượng học sinh, và tải về dưới dạng file Word (.docx) để tinh chỉnh.'
		},
		{
			q: 'Có thể sử dụng cho nhiều môn học không?',
			a: 'Hệ thống hỗ trợ toàn bộ các môn Khoa học tự nhiên (Vật lí, Hóa học, Sinh học, Toán học, Tin học) và tích hợp từ điển thuật ngữ chuyên ngành giáo dục CLIL.'
		},
		{
			q: 'Nội dung tài liệu được xử lý như thế nào?',
			a: 'Tài liệu giáo án của thầy cô chỉ được gửi đến mô hình AI để chuyển đổi ngôn ngữ, không lưu trữ công khai hoặc chia sẻ trái phép.'
		},
		{
			q: 'Công cụ có hỗ trợ xuất tài liệu không?',
			a: 'Có. Giáo án tiếng Anh hoàn thiện được xuất ra file .docx định dạng chuẩn A4, đầy đủ bảng biểu, định dạng tiêu đề, sẵn sàng đem in hoặc trình duyệt tổ chuyên môn.'
		}
	];
</script>

<svelte:head>
	<title>EduTranslate — Chuyển Đổi Giáo Án Việt - Anh Cho Giáo Viên</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F5EA] text-[#202820] font-sans selection:bg-[#E97855] selection:text-white">

	<!-- ========================================================================= -->
	<!-- SECTION A: MINIMAL NAVIGATION                                             -->
	<!-- ========================================================================= -->
	<header class="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-[#153D2B]/90 backdrop-blur-md border-b border-white/10 text-white">
		<div class="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-10 h-10 rounded-2xl bg-[#E97855] flex items-center justify-center text-white shadow-md shadow-[#E97855]/30 group-hover:scale-105 transition-transform">
					<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
						<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
					</svg>
				</div>
				<div class="flex flex-col">
					<span class="font-bold text-lg tracking-tight font-serif text-white">EduTranslate</span>
					<span class="text-[10px] tracking-wider uppercase text-[#77C9EE] font-semibold">Giáo Án Song Ngữ</span>
				</div>
			</a>

			<!-- Center Nav Links -->
			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
				<a href="#hero" class="hover:text-white transition-colors">Trang chủ</a>
				<a href="#features" class="hover:text-white transition-colors">Tính năng</a>
				<a href="#ecosystem" class="hover:text-white transition-colors">Cách hoạt động</a>
				<a href="#workspace" class="hover:text-white transition-colors">Trải nghiệm</a>
				<a href="#library" class="hover:text-white transition-colors">Thư viện</a>
				<a href="#faq" class="hover:text-white transition-colors">FAQ</a>
			</nav>

			<!-- Right CTAs -->
			<div class="flex items-center gap-3">
				{#if data.user}
					<a href="/dashboard">
						<Button class="bg-[#E97855] hover:bg-[#d86644] text-white font-semibold rounded-full px-5 shadow-lg shadow-[#E97855]/25">
							Vào Bảng Điều Khiển
						</Button>
					</a>
				{:else}
					<a href="/login" class="text-sm font-medium text-white/80 hover:text-white transition-colors px-3">
						Đăng nhập
					</a>
					<a href="/login">
						<Button class="bg-[#E97855] hover:bg-[#d86644] text-white font-semibold rounded-full px-5 shadow-lg shadow-[#E97855]/25">
							Bắt đầu ngay
						</Button>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- ========================================================================= -->
	<!-- SECTION B: IMMERSIVE HERO                                                 -->
	<!-- ========================================================================= -->
	<section id="hero" class="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-[#153D2B] text-white overflow-hidden">
		<!-- Sky atmosphere & soft clouds -->
		<div class="absolute inset-0 pointer-events-none -z-10">
			<div class="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-[#77C9EE]/25 via-[#24563B]/40 to-transparent"></div>
			<!-- SVG Soft Clouds -->
			<svg class="absolute top-16 left-12 w-64 text-white/10" viewBox="0 0 200 60" fill="currentColor">
				<path d="M20,40 Q30,20 50,30 Q70,10 90,25 Q110,15 130,30 Q150,20 170,40 Z" />
			</svg>
			<svg class="absolute top-24 right-16 w-80 text-white/10" viewBox="0 0 240 70" fill="currentColor">
				<path d="M20,50 Q40,25 70,35 Q100,10 130,30 Q160,20 190,35 Q210,25 230,50 Z" />
			</svg>
		</div>

		<div class="max-w-7xl mx-auto px-6 relative">
			<div class="grid lg:grid-cols-12 gap-12 items-center">
				
				<!-- Hero Copy (7 cols) -->
				<div class="lg:col-span-7 space-y-6 text-center lg:text-left">
					<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F4D77A] text-xs font-bold tracking-wider uppercase">
						<span class="w-2 h-2 rounded-full bg-[#E97855] animate-pulse"></span>
						TRỢ LÝ AI DÀNH CHO GIÁO VIÊN
					</div>

					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-[1.12] tracking-tight">
						Giáo án Việt – Anh, <br />
						<span class="text-[#F4D77A] italic">mở ra những cách dạy học mới.</span>
					</h1>

					<p class="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
						Chuyển đổi giáo án tiếng Việt sang tiếng Anh chuyên ngành giáo dục, thuận tiện rà soát và hoàn thiện trước khi sử dụng.
					</p>

					<div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
						<a href={data.user ? "/dashboard" : "/login"}>
							<Button size="lg" class="h-13 px-8 text-base bg-[#E97855] hover:bg-[#d86644] text-white font-bold rounded-full shadow-xl shadow-[#E97855]/30">
								Chuyển đổi giáo án →
							</Button>
						</a>
						<a href="#ecosystem">
							<Button size="lg" variant="outline" class="h-13 px-8 text-base border-white/30 bg-white/5 hover:bg-white/15 text-white font-medium rounded-full">
								Khám phá hành trình
							</Button>
						</a>
					</div>

					<p class="text-xs text-white/60 tracking-wide pt-2">
						✦ Từ tài liệu gốc đến giáo án song ngữ đạt chuẩn quốc tế
					</p>
				</div>

				<!-- Hero Visual Scene (5 cols) - Rich Isometric & Educational Illustration -->
				<div class="lg:col-span-5 relative">
					<div class="relative w-full aspect-square max-w-[460px] mx-auto rounded-3xl bg-[#24563B]/80 border border-white/15 p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
						<!-- Ambient light inside card -->
						<div class="absolute -top-16 -right-16 w-64 h-64 bg-[#77C9EE]/25 rounded-full blur-3xl"></div>
						<div class="absolute -bottom-16 -left-16 w-64 h-64 bg-[#E97855]/25 rounded-full blur-3xl"></div>

						<!-- Header of Card: Floating Translation Pill -->
						<div class="flex items-center justify-between z-10">
							<span class="px-3 py-1 rounded-full bg-white/15 text-xs text-white font-mono font-medium flex items-center gap-1.5">
								<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> AI Lesson Synthesizer
							</span>
							<div class="flex items-center gap-2 bg-[#153D2B] px-3 py-1 rounded-full border border-white/20 text-xs">
								<span class="font-bold text-[#F4D77A]">VI</span>
								<span class="text-white/40">➔</span>
								<span class="font-bold text-[#77C9EE]">EN</span>
							</div>
						</div>

						<!-- Core Visual: Illustrated Layered Book & Classroom Ecosystem -->
						<div class="my-auto py-6 relative flex items-center justify-center">
							<!-- Open Book Base Layer -->
							<div class="w-full max-w-[320px] rounded-2xl bg-[#FFFDF6] text-[#202820] p-5 shadow-2xl border border-black/10 rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
								<div class="flex items-center justify-between border-b border-black/10 pb-2 mb-3">
									<div class="flex items-center gap-1.5">
										<div class="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
										<div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
										<div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
									</div>
									<span class="text-[11px] font-bold text-[#24563B] font-serif">KHTN 7 • CLIL PLAN</span>
								</div>
								<div class="space-y-2 text-xs">
									<div class="p-2 rounded-lg bg-[#153D2B]/5 border border-[#153D2B]/10">
										<span class="text-[10px] font-bold uppercase tracking-wider text-[#153D2B]">Tiêu đề gốc:</span>
										<p class="font-semibold text-slate-800">Bài 4: Sơ lược về bảng tuần hoàn</p>
									</div>
									<div class="p-2 rounded-lg bg-[#E97855]/10 border border-[#E97855]/20">
										<span class="text-[10px] font-bold uppercase tracking-wider text-[#E97855]">Bản dịch CLIL:</span>
										<p class="font-semibold text-slate-900">Unit 4: The Periodic Table Overview</p>
									</div>
								</div>
							</div>

							<!-- Floating Badge Cards -->
							<div class="absolute -top-2 -right-2 bg-[#FFFDF6] text-[#202820] text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xl border border-black/10 flex items-center gap-2 animate-bounce">
								<span>🎯</span> Chuẩn mục tiêu Bloom
							</div>
							<div class="absolute -bottom-2 -left-2 bg-[#153D2B] text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-xl border border-white/20 flex items-center gap-2">
								<span class="text-amber-400">🔊</span> Phiên âm IPA chuẩn
							</div>
						</div>

						<!-- Footer of visual -->
						<div class="flex items-center justify-between text-xs text-white/70 pt-2 border-t border-white/10 z-10">
							<span>Phù hợp THCS & THPT</span>
							<span class="text-[#F4D77A] font-semibold">Tự động cấu trúc 45 phút/tiết</span>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- Organic SVG wave transition into Ivory (#F7F5EA) -->
		<div class="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
			<svg class="relative block w-full h-16 sm:h-24 text-[#F7F5EA]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
				<path d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z"></path>
			</svg>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION C: TRANSITION: FROM IDEAS TO IMPACT                               -->
	<!-- ========================================================================= -->
	<section class="py-24 bg-[#F7F5EA]">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-4">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					TỪ Ý TƯỞNG ĐẾN BÀI GIẢNG
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Mỗi giáo án là một hành trình học tập.
				</h2>
				<p class="text-base text-[#72786F] leading-relaxed">
					Ngôn ngữ không nên là rào cản khi giáo viên muốn chia sẻ kiến thức, đổi mới hoạt động dạy học và xây dựng tài liệu song ngữ.
				</p>
			</div>

			<!-- Three Large Illustrated Educational Objects in Asymmetric Flow -->
			<div class="grid md:grid-cols-3 gap-8">
				
				<!-- Object 1 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
					<div>
						<div class="w-16 h-16 rounded-2xl bg-[#153D2B]/10 text-[#153D2B] flex items-center justify-center text-3xl mb-6">
							🏫
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">Giai đoạn 1</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Chuẩn bị nội dung</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							Tài liệu sẵn có từ sách giáo khoa, bài giảng thuyết trình hoặc giáo án soạn thảo bằng tiếng Việt của nhà trường.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold">
						✦ Giữ trọn vẹn mục tiêu kiến thức
					</div>
				</div>

				<!-- Object 2 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
					<div>
						<div class="w-16 h-16 rounded-2xl bg-[#77C9EE]/20 text-[#153D2B] flex items-center justify-center text-3xl mb-6">
							📖
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">Giai đoạn 2</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Chuyển hóa sư phạm</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							AI phân tách hoạt động của giáo viên và học sinh, chọn lọc thuật ngữ tiếng Anh học thuật phù hợp cấp học.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold">
						✦ Cấu trúc rõ ràng theo tiến trình 5E/CLIL
					</div>
				</div>

				<!-- Object 3 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
					<div>
						<div class="w-16 h-16 rounded-2xl bg-[#E97855]/15 text-[#E97855] flex items-center justify-center text-3xl mb-6">
							📑
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">Giai đoạn 3</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Giáo án song ngữ</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							Bộ tài liệu tiếng Anh hoàn thiện kèm thẻ từ vựng phát âm chuẩn xác, sẵn sàng đem lên lớp giảng dạy.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold">
						✦ Xuất file Word (.docx) chuyên nghiệp
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION D: THE TRANSLATION ECOSYSTEM (Isometric Flow)                     -->
	<!-- ========================================================================= -->
	<section id="ecosystem" class="py-24 bg-[#FFFDF6] border-y border-[#202820]/10">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#E97855]">
					HỆ SINH THÁI CHUYỂN ĐỔI
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Một quy trình, nhiều giá trị cho giáo viên.
				</h2>
				<p class="text-sm text-[#72786F]">
					Mô hình 4 trạm thông minh giúp chuyển đổi giáo án mượt mà và liền mạch.
				</p>
			</div>

			<!-- 4 Connected Isometric Stations -->
			<div class="grid md:grid-cols-4 gap-6 relative">
				
				<!-- Station 1 -->
				<div class="relative p-6 rounded-2xl bg-[#F7F5EA] border border-[#153D2B]/10 flex flex-col justify-between">
					<div class="space-y-3">
						<div class="w-10 h-10 rounded-xl bg-[#153D2B] text-white flex items-center justify-center font-bold text-sm">
							01
						</div>
						<h4 class="font-serif font-bold text-lg text-[#153D2B]">Chuẩn bị giáo án</h4>
						<p class="text-xs text-[#72786F] leading-relaxed">
							Tải lên tài liệu dạng PDF, Word hoặc gõ trực tiếp đoạn kế hoạch bài dạy tiếng Việt.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 text-[11px] font-semibold text-[#24563B]">
						Trạm thu nhận dữ liệu
					</div>
				</div>

				<!-- Station 2 -->
				<div class="relative p-6 rounded-2xl bg-[#F7F5EA] border border-[#153D2B]/10 flex flex-col justify-between">
					<div class="space-y-3">
						<div class="w-10 h-10 rounded-xl bg-[#24563B] text-white flex items-center justify-center font-bold text-sm">
							02
						</div>
						<h4 class="font-serif font-bold text-lg text-[#153D2B]">Phân tích nội dung</h4>
						<p class="text-xs text-[#72786F] leading-relaxed">
							AI bóc tách mục tiêu phẩm chất, năng lực, hoạt động học và danh mục thuật ngữ cốt lõi.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 text-[11px] font-semibold text-[#24563B]">
						Trạm giải mã giáo dục
					</div>
				</div>

				<!-- Station 3 -->
				<div class="relative p-6 rounded-2xl bg-[#F7F5EA] border border-[#153D2B]/10 flex flex-col justify-between">
					<div class="space-y-3">
						<div class="w-10 h-10 rounded-xl bg-[#E97855] text-white flex items-center justify-center font-bold text-sm">
							03
						</div>
						<h4 class="font-serif font-bold text-lg text-[#153D2B]">Chuyển đổi Việt – Anh</h4>
						<p class="text-xs text-[#72786F] leading-relaxed">
							Dịch chuẩn văn phong sư phạm quốc tế, tự động sinh phiên âm IPA và ví dụ giải thích.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 text-[11px] font-semibold text-[#24563B]">
						Trạm ngôn ngữ CLIL
					</div>
				</div>

				<!-- Station 4 -->
				<div class="relative p-6 rounded-2xl bg-[#F7F5EA] border border-[#153D2B]/10 flex flex-col justify-between">
					<div class="space-y-3">
						<div class="w-10 h-10 rounded-xl bg-[#77C9EE] text-[#153D2B] flex items-center justify-center font-bold text-sm">
							04
						</div>
						<h4 class="font-serif font-bold text-lg text-[#153D2B]">Rà soát & hoàn thiện</h4>
						<p class="text-xs text-[#72786F] leading-relaxed">
							Giáo viên kiểm tra trực tiếp, nghe thử phát âm từ vựng và tải file Word hoàn chỉnh.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 text-[11px] font-semibold text-[#24563B]">
						Trạm xuất bản bài giảng
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION E: THE ACTUAL PRODUCT (Interactive Demo Workspace)                -->
	<!-- ========================================================================= -->
	<section id="workspace" class="py-24 bg-[#F7F5EA]">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-12 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					TRẢI NGHIỆM CÔNG CỤ
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Thử chuyển đổi một đoạn giáo án của bạn.
				</h2>
				<p class="text-sm text-[#72786F]">
					Trải nghiệm tức thì phương thức trích xuất và dịch tự động dành riêng cho tài liệu dạy học.
				</p>
			</div>

			<!-- Workspace Card Container -->
			<div class="rounded-3xl bg-[#FFFDF6] border border-[#202820]/15 shadow-xl p-6 lg:p-8">
				
				<!-- Filters & Controls Bar -->
				<div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#202820]/10">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-xs font-semibold text-[#72786F]">Môn học:</span>
						{#each ['Tin học', 'Toán học', 'Vật lí', 'Hóa học', 'Sinh học'] as sub}
							<button
								type="button"
								onclick={() => handleSubjectChange(sub)}
								class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer {selectedSubject === sub ? 'bg-[#153D2B] text-white shadow-sm' : 'bg-[#F7F5EA] text-[#202820] hover:bg-[#153D2B]/10'}"
							>
								{sub}
							</button>
						{/each}
					</div>

					<div class="flex items-center gap-2 text-xs">
						<span class="text-[#72786F] font-semibold">Văn phong:</span>
						<span class="px-3 py-1 rounded-full bg-[#E97855]/15 text-[#E97855] font-bold">
							Theo văn phong giáo án
						</span>
					</div>
				</div>

				<!-- Dual-Panel Grid -->
				<div class="grid lg:grid-cols-2 gap-6 pt-6">
					
					<!-- Left: Vietnamese Source -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<label for="vi-source" class="text-xs font-bold uppercase tracking-wider text-[#153D2B] flex items-center gap-2">
								<span>🇻🇳</span> Giáo án tiếng Việt
							</label>
							<span class="text-[11px] text-[#72786F]">Đoạn mẫu ({selectedSubject})</span>
						</div>
						<textarea
							id="vi-source"
							bind:value={sourceText}
							rows="9"
							class="w-full rounded-2xl border border-[#202820]/15 bg-[#F7F5EA]/70 p-4 text-xs sm:text-sm font-sans leading-relaxed text-[#202820] focus:ring-2 focus:ring-[#153D2B] focus:outline-none resize-none"
							placeholder="Nhập mục tiêu, hoạt động hoặc nội dung bài giảng..."
						></textarea>
					</div>

					<!-- Right: English Output -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<label for="en-result" class="text-xs font-bold uppercase tracking-wider text-[#153D2B] flex items-center gap-2">
								<span>🇬🇧</span> English lesson plan
							</label>
							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={handleCopy}
									class="text-xs text-[#24563B] hover:text-[#153D2B] font-semibold flex items-center gap-1 cursor-pointer"
								>
									{copied ? '✓ Đã sao chép' : '📋 Sao chép'}
								</button>
							</div>
						</div>
						<div class="relative">
							<textarea
								id="en-result"
								readonly
								value={resultText}
								rows="9"
								class="w-full rounded-2xl border border-[#202820]/15 bg-[#FFFDF6] p-4 text-xs sm:text-sm font-sans leading-relaxed text-[#202820] focus:outline-none resize-none {isTranslating ? 'opacity-40' : ''}"
							></textarea>
							{#if isTranslating}
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="px-4 py-2 rounded-full bg-[#153D2B] text-white text-xs font-semibold shadow-lg flex items-center gap-2">
										<span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										Đang chuyển đổi...
									</div>
								</div>
							{/if}
						</div>
					</div>

				</div>

				<!-- Center Action Bar -->
				<div class="mt-8 pt-6 border-t border-[#202820]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="flex items-center gap-2 text-xs text-[#72786F]">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						Chế độ demo trực tiếp (Demo mode)
					</div>

					<Button
						onclick={handleTranslate}
						disabled={isTranslating}
						class="w-full sm:w-auto px-8 h-12 bg-[#E97855] hover:bg-[#d86644] text-white font-bold rounded-full shadow-lg shadow-[#E97855]/20 cursor-pointer"
					>
						Chuyển sang tiếng Anh →
					</Button>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION F: WHAT MAKES IT USEFUL (Editorial Split)                         -->
	<!-- ========================================================================= -->
	<section id="features" class="py-24 bg-[#FFFDF6] border-t border-[#202820]/10">
		<div class="max-w-6xl mx-auto px-6">
			<div class="grid lg:grid-cols-12 gap-12 items-center">
				
				<!-- Left Text (6 cols) -->
				<div class="lg:col-span-6 space-y-8">
					<div class="space-y-4">
						<span class="text-xs font-bold uppercase tracking-widest text-[#E97855]">
							GIÁ TRỊ THỰC TẾ
						</span>
						<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B] leading-tight">
							Không chỉ là dịch ngôn ngữ. <br />
							<span class="italic text-[#24563B]">Đó là giữ trọn ý tưởng bài giảng.</span>
						</h2>
					</div>

					<div class="space-y-6">
						<div class="flex gap-4">
							<div class="w-10 h-10 rounded-xl bg-[#153D2B]/10 text-[#153D2B] flex items-center justify-center font-bold text-lg flex-shrink-0">
								1
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-[#153D2B]">Thuật ngữ giáo dục phù hợp</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Dịch mục tiêu, chuỗi hoạt động học và tiêu chí đánh giá sát với ngôn ngữ sư phạm quốc tế, không dịch máy word-by-word.
								</p>
							</div>
						</div>

						<div class="flex gap-4">
							<div class="w-10 h-10 rounded-xl bg-[#77C9EE]/25 text-[#153D2B] flex items-center justify-center font-bold text-lg flex-shrink-0">
								2
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-[#153D2B]">Cấu trúc giáo án dễ theo dõi</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Bảo tồn đầy đủ tiêu đề, bảng biểu 2 cột giáo viên - học sinh, thứ tự bài tập và phân bổ thời gian từng tiết dạy.
								</p>
							</div>
						</div>

						<div class="flex gap-4">
							<div class="w-10 h-10 rounded-xl bg-[#E97855]/15 text-[#E97855] flex items-center justify-center font-bold text-lg flex-shrink-0">
								3
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-[#153D2B]">Chủ động rà soát & chỉnh sửa</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Cho phép thầy cô kiểm tra, chỉnh sửa câu chữ, nghe phát âm thuật ngữ và lưu trữ thư viện bài dạy cá nhân.
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Illustrated Card (6 cols) -->
				<div class="lg:col-span-6">
					<div class="rounded-3xl bg-[#F7F5EA] p-8 border border-[#153D2B]/15 shadow-xl relative overflow-hidden">
						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-black/10 pb-4">
								<span class="text-xs font-bold uppercase tracking-wider text-[#24563B]">Bản xem trước giáo án chuẩn</span>
								<span class="px-2.5 py-1 rounded bg-[#E97855] text-white text-[11px] font-bold">Word .docx Ready</span>
							</div>

							<div class="space-y-3 font-mono text-xs">
								<div class="p-3 rounded-xl bg-white border border-black/5 shadow-sm">
									<p class="text-[#153D2B] font-bold"># I. OBJECTIVES (Mục tiêu bài dạy)</p>
									<p class="text-slate-600 mt-1">1. Knowledge: Describe properties of chemical compounds...</p>
									<p class="text-slate-600">2. Competences: Scientific reasoning & collaborative inquiry...</p>
								</div>

								<div class="p-3 rounded-xl bg-white border border-black/5 shadow-sm">
									<p class="text-[#153D2B] font-bold"># II. TEACHING & LEARNING ACTIVITIES</p>
									<p class="text-slate-600 mt-1">Activity 1: Warm-up & Prior knowledge retrieval (7 mins)</p>
									<p class="text-slate-600">Activity 2: Experiential lab investigation (20 mins)</p>
								</div>

								<div class="p-3 rounded-xl bg-white border border-black/5 shadow-sm">
									<p class="text-[#E97855] font-bold"># III. SCIENTIFIC VOCABULARY & IPA</p>
									<p class="text-slate-600 mt-1">✦ Photosynthesis /ˌfəʊtəʊˈsɪnθəsɪs/: Quang hợp</p>
									<p class="text-slate-600">✦ Chloroplast /ˈklɔːrəplæst/: Lục lạp</p>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION G: HOW IT WORKS                                                   -->
	<!-- ========================================================================= -->
	<section class="py-24 bg-[#F7F5EA]">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					BA BƯỚC ĐƠN GIẢN
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Bắt đầu từ giáo án bạn đã có.
				</h2>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4">
					<div class="w-14 h-14 mx-auto rounded-2xl bg-[#153D2B] text-white flex items-center justify-center font-serif text-2xl font-bold">
						01
					</div>
					<h3 class="text-lg font-bold font-serif text-[#153D2B]">Tải tài liệu</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed">
						Chọn tệp giáo án có sẵn ở định dạng Word, PDF hoặc hình ảnh tài liệu soạn thảo.
					</p>
				</div>

				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4">
					<div class="w-14 h-14 mx-auto rounded-2xl bg-[#E97855] text-white flex items-center justify-center font-serif text-2xl font-bold">
						02
					</div>
					<h3 class="text-lg font-bold font-serif text-[#153D2B]">Chọn cách chuyển đổi</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed">
						Lựa chọn môn học, văn phong sư phạm và số tiết học dự kiến cho bài dạy.
					</p>
				</div>

				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4">
					<div class="w-14 h-14 mx-auto rounded-2xl bg-[#77C9EE] text-[#153D2B] flex items-center justify-center font-serif text-2xl font-bold">
						03
					</div>
					<h3 class="text-lg font-bold font-serif text-[#153D2B]">Rà soát & hoàn thiện</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed">
						Xem trước bản tiếng Anh, luyện phát âm từ vựng và xuất file Word hoàn chỉnh.
					</p>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION H: LESSON PLAN LIBRARY                                            -->
	<!-- ========================================================================= -->
	<section id="library" class="py-24 bg-[#FFFDF6] border-t border-[#202820]/10">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#E97855]">
					KHÁM PHÁ THƯ VIỆN
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Những mẫu giáo án truyền cảm hứng.
				</h2>
				<p class="text-sm text-[#72786F]">
					Tham khảo tuyển tập các bài dạy song ngữ mẫu theo chương trình GDPT mới.
				</p>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
				
				<!-- Library Card 1 -->
				<div class="p-6 rounded-2xl bg-[#F7F5EA] border border-[#202820]/10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
					<div class="space-y-3">
						<span class="px-2.5 py-1 rounded bg-[#153D2B] text-white text-[10px] font-bold uppercase">Tin học 8</span>
						<h4 class="font-serif font-bold text-base text-[#153D2B]">Thuật toán tìm kiếm & sắp xếp</h4>
						<p class="text-xs text-[#72786F]">2 tiết • Linear Search & Binary Search • Hoạt động nhóm</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#24563B]">
						<span>Bản mẫu CLIL</span>
						<span>Xem trước →</span>
					</div>
				</div>

				<!-- Library Card 2 -->
				<div class="p-6 rounded-2xl bg-[#F7F5EA] border border-[#202820]/10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
					<div class="space-y-3">
						<span class="px-2.5 py-1 rounded bg-[#24563B] text-white text-[10px] font-bold uppercase">Toán học 9</span>
						<h4 class="font-serif font-bold text-base text-[#153D2B]">Hệ thức lượng trong tam giác</h4>
						<p class="text-xs text-[#72786F]">3 tiết • Trigonometry ratios • Ứng dụng đo đạc thực địa</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#24563B]">
						<span>Bản mẫu CLIL</span>
						<span>Xem trước →</span>
					</div>
				</div>

				<!-- Library Card 3 -->
				<div class="p-6 rounded-2xl bg-[#F7F5EA] border border-[#202820]/10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
					<div class="space-y-3">
						<span class="px-2.5 py-1 rounded bg-[#E97855] text-white text-[10px] font-bold uppercase">KHTN 7 (Hóa)</span>
						<h4 class="font-serif font-bold text-base text-[#153D2B]">Nguyên tử & Liên kết hóa học</h4>
						<p class="text-xs text-[#72786F]">4 tiết • Atomic structure & Covalent bonding • Mô hình 3D</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#24563B]">
						<span>Bản mẫu CLIL</span>
						<span>Xem trước →</span>
					</div>
				</div>

				<!-- Library Card 4 -->
				<div class="p-6 rounded-2xl bg-[#F7F5EA] border border-[#202820]/10 flex flex-col justify-between hover:-translate-y-1 transition-transform">
					<div class="space-y-3">
						<span class="px-2.5 py-1 rounded bg-[#77C9EE] text-[#153D2B] text-[10px] font-bold uppercase">KHTN 8 (Sinh)</span>
						<h4 class="font-serif font-bold text-base text-[#153D2B]">Hệ tuần hoàn & Bảo vệ tim</h4>
						<p class="text-xs text-[#72786F]">2 tiết • Cardiovascular health • Thực hành đo nhịp tim</p>
					</div>
					<div class="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#24563B]">
						<span>Bản mẫu CLIL</span>
						<span>Xem trước →</span>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION I: FAQ ACCORDION                                                  -->
	<!-- ========================================================================= -->
	<section id="faq" class="py-24 bg-[#F7F5EA]">
		<div class="max-w-4xl mx-auto px-6">
			
			<div class="text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					GIẢI ĐÁP THẮC MẮC
				</span>
				<h2 class="text-3xl sm:text-4xl font-serif font-bold text-[#153D2B]">
					Câu hỏi thường gặp
				</h2>
			</div>

			<div class="space-y-4">
				{#each faqs as faq, i}
					<div class="rounded-2xl bg-[#FFFDF6] border border-[#202820]/10 overflow-hidden shadow-sm transition-all">
						<button
							type="button"
							onclick={() => toggleFaq(i)}
							class="w-full p-5 text-left font-bold text-sm sm:text-base text-[#153D2B] flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02]"
						>
							<span>{faq.q}</span>
							<span class="w-6 h-6 rounded-full bg-[#153D2B]/10 flex items-center justify-center text-xs flex-shrink-0">
								{openFaq === i ? '−' : '+'}
							</span>
						</button>
						{#if openFaq === i}
							<div class="px-5 pb-5 text-xs sm:text-sm text-[#72786F] leading-relaxed border-t border-black/5 pt-3">
								{faq.a}
							</div>
						{/if}
					</div>
				{/each}
			</div>

		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION J: FINAL ILLUSTRATED CTA                                          -->
	<!-- ========================================================================= -->
	<section class="py-24 bg-[#153D2B] text-white relative overflow-hidden">
		<!-- Organic Landscape Decorative background -->
		<div class="absolute -top-32 -left-32 w-96 h-96 bg-[#24563B] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
		<div class="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E97855]/30 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

		<div class="max-w-4xl mx-auto px-6 text-center relative space-y-8">
			<div class="w-16 h-16 mx-auto rounded-3xl bg-[#E97855] flex items-center justify-center text-3xl shadow-xl shadow-[#E97855]/30">
				🌱
			</div>

			<h2 class="text-4xl sm:text-5xl font-serif font-bold leading-tight">
				Cùng mở rộng không gian <br />
				<span class="text-[#F4D77A] italic">cho những bài giảng tốt hơn.</span>
			</h2>

			<p class="text-base sm:text-lg text-white/80 max-w-xl mx-auto font-light leading-relaxed">
				Bắt đầu từ một giáo án tiếng Việt và khám phá cách bạn có thể chuẩn bị phiên bản tiếng Anh chuẩn xác, chuyên nghiệp.
			</p>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
				<a href={data.user ? "/dashboard" : "/login"}>
					<Button size="lg" class="h-13 px-8 text-base bg-[#E97855] hover:bg-[#d86644] text-white font-bold rounded-full shadow-2xl shadow-[#E97855]/40 cursor-pointer">
						Bắt đầu chuyển đổi →
					</Button>
				</a>
				<a href="#hero">
					<Button size="lg" variant="outline" class="h-13 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full cursor-pointer">
						Quay lại đầu trang ↑
					</Button>
				</a>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION K: FOOTER                                                         -->
	<!-- ========================================================================= -->
	<footer class="py-12 bg-[#F7F5EA] border-t border-[#202820]/10 text-xs text-[#72786F]">
		<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-xl bg-[#153D2B] text-white flex items-center justify-center font-bold text-sm">
					E
				</div>
				<div>
					<p class="font-bold text-[#153D2B] text-sm">EduTranslate</p>
					<p class="text-[11px]">Nền tảng hỗ trợ chuyển đổi giáo án song ngữ cho giáo viên Việt Nam.</p>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-6">
				<a href="#hero" class="hover:text-[#153D2B] transition-colors">Trang chủ</a>
				<a href="#features" class="hover:text-[#153D2B] transition-colors">Tính năng</a>
				<a href="#workspace" class="hover:text-[#153D2B] transition-colors">Trải nghiệm</a>
				<a href="#faq" class="hover:text-[#153D2B] transition-colors">FAQ</a>
				<a href="/login" class="hover:text-[#153D2B] transition-colors">Đăng nhập</a>
			</div>
		</div>
		<div class="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-black/5 text-center text-[11px] text-[#72786F]/70">
			© 2026 EduTranslate. All rights reserved. Designed for bilingual educators.
		</div>
	</footer>

</div>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	// Mobile nav toggle
	let mobileMenuOpen = $state(false);

	// Interactive Translation Demo State
	let selectedSubject = $state('Tin học');
	let selectedStyle = $state('Theo văn phong giáo án');
	let isTranslating = $state(false);
	let copied = $state(false);

	interface SubjectPreset {
		title: string;
		grade: string;
		vi: string;
		en: string;
		vocabulary: { word: string; ipa: string; vi: string }[];
	}

	const demoPresets: Record<string, SubjectPreset> = {
		'Tin học': {
			title: 'Thuật toán tìm kiếm tuần tự & nhị phân',
			grade: 'Tin học 8 • THCS',
			vi: `I. MỤC TIÊU BÀI DẠY:
1. Năng lực Tin học:
- Nắm vững khái niệm thuật toán tìm kiếm tuần tự (Linear Search) và tìm kiếm nhị phân (Binary Search).
- Mô tả được các bước lặp và điều kiện dừng khi duyệt mảng dữ liệu.
2. Năng lực chung: Tự chủ giải quyết vấn đề mô phỏng thuật toán.

II. HOẠT ĐỘNG KHỞI ĐỘNG (5 phút):
- Giáo viên đặt câu hỏi: "Làm thế nào để tìm một cuốn sách cụ thể trên một kệ sách đã được sắp xếp theo thứ tự bảng chữ cái?"
- Học sinh thảo luận theo cặp và trình bày ý tưởng phân đôi kệ sách để tìm nhanh nhất.`,
			en: `## **I. LESSON OBJECTIVES**
a. Computer Science Competencies:
- Master the computational logic behind Linear Search and Binary Search algorithms.
- Formulate precise loop termination criteria when traversing sequential data arrays.
b. Core General Competencies: Collaborative inquiry & systematic algorithmic reasoning.

## **II. WARM-UP & ENGAGEMENT (5 mins)**
- The instructor presents a guided scenario: *"How would you efficiently locate a specific reference book in an alphabetically indexed library shelf?"*
- Students conduct think-pair-share discussions, establishing the principle of divide-and-conquer search intervals.`,
			vocabulary: [
				{ word: 'Algorithm', ipa: '/ˈælɡərɪðəm/', vi: 'Thuật toán' },
				{ word: 'Binary Search', ipa: '/ˈbaɪnəri sɜːtʃ/', vi: 'Tìm kiếm nhị phân' },
				{ word: 'Data Array', ipa: '/ˈdeɪtə əˈreɪ/', vi: 'Mảng dữ liệu' }
			]
		},
		'Toán học': {
			title: 'Định lý Pythagoras & Hệ thức lượng',
			grade: 'Toán học 9 • THCS',
			vi: `I. MỤC TIÊU BÀI DẠY:
1. Kiến thức & Kỹ năng:
- Phát biểu và chứng minh định lý Pythagoras trong tam giác vuông: a² + b² = c².
- Ứng dụng định lý để tính độ dài cạnh huyền và giải bài toán đo đạc thực tế.
2. Phẩm chất: Tính cẩn thận, chính xác trong biểu diễn đại số và hình học.

II. HOẠT ĐỘNG KHÁM PHÁ (15 phút):
- Học sinh ghép 4 tam giác vuông bằng nhau vào hình vuông lớn để chứng minh diện tích.
- Ghi nhận hệ thức: Tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông bằng diện tích hình vuông dựng trên cạnh huyền.`,
			en: `## **I. LESSON OBJECTIVES**
a. Mathematical Knowledge & Cognitive Skills:
- Articulate and verify geometric proofs for the Pythagorean Theorem: $$a^2 + b^2 = c^2$$.
- Apply algebraic deduction to compute unknown hypotenuse lengths in real-world triangulation problems.
b. Core Dispositions: Spatial precision and deductive reasoning rigor.

## **II. GUIDED EXPLORATION (15 mins)**
- Students assemble four congruent right-angled triangles within a master square frame to verify invariant area equality.
- Formalize conclusion: The sum of squares constructed on adjacent legs equals the square area upon the hypotenuse.`,
			vocabulary: [
				{ word: 'Hypotenuse', ipa: '/haɪˈpɒtənjuːz/', vi: 'Cạnh huyền' },
				{ word: 'Pythagorean Theorem', ipa: '/paɪˌθæɡəˈriːən ˈθɪərəm/', vi: 'Định lý Pythagoras' },
				{ word: 'Congruent', ipa: '/ˈkɒŋɡruənt/', vi: 'Bằng nhau / Đồng dạng' }
			]
		},
		'Vật lí': {
			title: 'Định luật bảo toàn cơ năng & Con lắc',
			grade: 'Vật lí 10 • THPT',
			vi: `I. MỤC TIÊU BÀI DẠY:
1. Nhận thức Vật lí:
- Phát biểu định luật bảo toàn và chuyển hóa cơ năng: W = Wđ + Wt = const.
- Phân tích sự chuyển hóa tương hỗ giữa động năng và thế năng trọng trường của con lắc đơn.
2. Tìm hiểu thế giới tự nhiên: Thu thập số liệu đo chu kỳ dao động và ma sát cản.

II. HOẠT ĐỘNG THỰC NGHIỆM (20 phút):
- Giáo viên cho con lắc dao động thả từ góc lệch ban đầu α₀.
- Học sinh dùng cảm biến quang điện ghi lại vận tốc tại vị trí cân bằng và so sánh cơ năng lý thuyết.`,
			en: `## **I. LESSON OBJECTIVES**
a. Physics Conceptual Knowledge:
- State the law of conservation of mechanical energy: $$W = W_k + W_p = \\text{const}$$.
- Analyze dynamic interplay between kinetic energy and gravitational potential energy in simple pendulum oscillation.
b. Scientific Inquiry: Collect experimental oscillation periods while accounting for air drag factors.

## **II. EXPERIENTIAL LAB EXPERIMENT (20 mins)**
- The educator releases a spherical pendulum bob from an initial angular displacement $$a_0$$.
- Students employ photogate sensors to capture velocity at equilibrium and evaluate theoretical mechanical conservation.`,
			vocabulary: [
				{ word: 'Kinetic Energy', ipa: '/kɪˈnetɪk ˈenədʒi/', vi: 'Động năng' },
				{ word: 'Potential Energy', ipa: '/pəˈtenʃl ˈenədʒi/', vi: 'Thế năng' },
				{ word: 'Equilibrium', ipa: '/ˌekwɪˈlɪbriəm/', vi: 'Vị trí cân bằng' }
			]
		},
		'Hóa học': {
			title: 'Bảng tuần hoàn các nguyên tố hóa học',
			grade: 'KHTN 7 (Hóa) • THCS',
			vi: `I. MỤC TIÊU BÀI DẠY:
1. Năng lực Hóa học:
- Trình bày được cấu tạo bảng tuần hoàn gồm ô nguyên tố, chu kì và nhóm.
- Xác định vị trí của kim loại, phi kim và khí hiếm trong bảng tuần hoàn.
2. Vận dụng kiến thức: Giải thích sự biến đổi tính kim loại - phi kim dọc chu kì và phân nhóm.

II. HOẠT ĐỘNG HỌC TẬP (15 phút):
- Chia lớp thành các nhóm chuyên gia tìm hiểu từng gia đình nguyên tố (Kim loại kiềm, Halogen, Khí hiếm).
- Vẽ sơ đồ nguyên tử mẫu của Natri (Z=11) và Clo (Z=17).`,
			en: `## **I. LESSON OBJECTIVES**
a. Chemical Competencies:
- Identify architectural constituents of the Periodic Table: atomic cells, periods, and elemental groups.
- Locate and differentiate metallic elements, non-metals, and noble gases across respective blocks.
b. Applied Science: Explain systematic electronegativity and metallic property trends along periods and groups.

## **II. INQUIRY LAB ACTIVITY (15 mins)**
- Students organize into jigsaw teams to investigate elemental chemical families (Alkali Metals, Halogens, Noble Gases).
- Render electron shell orbital models for Sodium ($$Z=11$$) and Chlorine ($$Z=17$$).`,
			vocabulary: [
				{ word: 'Periodic Table', ipa: '/ˌpɪəriˈɒdɪk ˈteɪbl/', vi: 'Bảng tuần hoàn' },
				{ word: 'Noble Gas', ipa: '/ˈnəʊbl ɡæs/', vi: 'Khí hiếm' },
				{ word: 'Atomic Number', ipa: '/əˈtɒmɪk ˈnʌmbə(r)/', vi: 'Số hiệu nguyên tử' }
			]
		},
		'Sinh học': {
			title: 'Cấu tạo tế bào & Năng lượng sinh học',
			grade: 'KHTN 6-7 (Sinh) • THCS',
			vi: `I. MỤC TIÊU BÀI DẠY:
1. Nhận thức Sinh học:
- So sánh cấu tạo tế bào nhân thực thực vật và động vật; nhận diện vai trò của thành tế bào, lục lạp và ti thể.
- Nêu mối liên hệ giữa quang hợp (lục lạp) và hô hấp tế bào (ti thể).
2. Kỹ năng thực hành: Soi tiêu bản kính hiển vi và vẽ lát cắt tế bào biểu bì vảy hành.

II. HOẠT ĐỘNG KHÁM PHÁ (15 phút):
- Quan sát mô hình 3D tế bào thực vật.
- Lập bảng so sánh 2 cột chỉ ra các bào quan đặc trưng cho từng loại tế bào.`,
			en: `## **I. LESSON OBJECTIVES**
a. Biological Understanding:
- Contrast eukaryotic cellular ultrastructure between plant and animal cells; identify critical functions of cell wall, chloroplasts, and mitochondria.
- Elucidate reciprocal bioenergetic pathways linking chloroplast photosynthesis and mitochondrial cellular respiration.
b. Practical Laboratory Skills: Microscope slide examination and microscopic sketching of onion epidermal cells.

## **II. GUIDED INVESTIGATION (15 mins)**
- Observe interactive 3D eukaryotic cell models.
- Construct comparative two-column matrices identifying distinctive organelles for each taxonomic kingdom.`,
			vocabulary: [
				{ word: 'Mitochondria', ipa: '/ˌmaɪtəˈkɒndriə/', vi: 'Ti thể' },
				{ word: 'Chloroplast', ipa: '/ˈklɔːrəplæst/', vi: 'Lục lạp' },
				{ word: 'Cellular Respiration', ipa: '/ˈseljələ ˌrespəˈreɪʃn/', vi: 'Hô hấp tế bào' }
			]
		}
	};

	let sourceText = $state(demoPresets['Tin học'].vi);
	let resultText = $state(demoPresets['Tin học'].en);
	let currentVocab = $state(demoPresets['Tin học'].vocabulary);

	function handleSubjectChange(sub: string) {
		selectedSubject = sub;
		if (demoPresets[sub]) {
			sourceText = demoPresets[sub].vi;
			resultText = demoPresets[sub].en;
			currentVocab = demoPresets[sub].vocabulary;
		}
	}

	function handleTranslate() {
		isTranslating = true;
		setTimeout(() => {
			if (demoPresets[selectedSubject]) {
				resultText = demoPresets[selectedSubject].en;
				currentVocab = demoPresets[selectedSubject].vocabulary;
			}
			isTranslating = false;
		}, 550);
	}

	function handleCopy() {
		navigator.clipboard.writeText(resultText);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Library Filter
	let libraryFilter = $state('Tất cả');
	const libraryItems = [
		{
			subject: 'Tin học',
			grade: 'Lớp 8 • THCS',
			title: 'Thuật toán tìm kiếm tuần tự & nhị phân',
			badgeColor: 'bg-[#153D2B] text-white',
			summary: 'Thiết kế chuỗi hoạt động khám phá và mã giả giải quyết bài toán mảng số.',
			pages: '4 trang',
			time: '2 tiết'
		},
		{
			subject: 'Toán học',
			grade: 'Lớp 9 • THCS',
			title: 'Định lý Pythagoras & Đo đạc tam giác',
			badgeColor: 'bg-[#24563B] text-white',
			summary: 'Ứng dụng định lý giải quyết bài toán thực địa hình học không gian.',
			pages: '5 trang',
			time: '3 tiết'
		},
		{
			subject: 'Khoa học tự nhiên',
			grade: 'Lớp 7 • KHTN',
			title: 'Bảng tuần hoàn các nguyên tố hóa học',
			badgeColor: 'bg-[#E97855] text-white',
			summary: 'Kế hoạch bài dạy CLIL với sơ đồ orbital và bảng nguyên tố song ngữ.',
			pages: '6 trang',
			time: '4 tiết'
		},
		{
			subject: 'Giáo án song ngữ',
			grade: 'Lớp 10 • THPT',
			title: 'Định luật bảo toàn cơ năng & Con lắc',
			badgeColor: 'bg-[#77C9EE] text-[#153D2B]',
			summary: 'Tích hợp cảm biến số liệu và bảng đối chiếu từ vựng chuyên ngành Vật lí.',
			pages: '5 trang',
			time: '2 tiết'
		}
	];

	const filteredLibrary = $derived(
		libraryFilter === 'Tất cả'
			? libraryItems
			: libraryItems.filter((item) => item.subject === libraryFilter)
	);

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
	<header class="fixed top-0 inset-x-0 z-50 bg-[#153D2B]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
		<div class="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
			<!-- Logo: Book / Document Motif -->
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-10 h-10 rounded-2xl bg-[#E97855] flex items-center justify-center text-white shadow-md shadow-[#E97855]/30 group-hover:scale-105 transition-transform">
					<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
						<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
					</svg>
				</div>
				<div class="flex flex-col">
					<span class="font-bold text-xl tracking-tight font-serif text-white">EduTranslate</span>
					<span class="text-[10px] tracking-widest uppercase text-[#77C9EE] font-semibold">Giáo Án Song Ngữ</span>
				</div>
			</a>

			<!-- Center Links -->
			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
				<a href="#hero" class="hover:text-white transition-colors">Trang chủ</a>
				<a href="#transition-section" class="hover:text-white transition-colors">Ý tưởng</a>
				<a href="#ecosystem" class="hover:text-white transition-colors">Hệ sinh thái</a>
				<a href="#workspace" class="hover:text-white transition-colors">Trải nghiệm</a>
				<a href="#features" class="hover:text-white transition-colors">Tính năng</a>
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
					<a href="/login" class="text-sm font-medium text-white/80 hover:text-white transition-colors px-2">
						Đăng nhập
					</a>
					<a href="/login">
						<Button class="bg-[#E97855] hover:bg-[#d86644] text-white font-semibold rounded-full px-5 shadow-lg shadow-[#E97855]/25">
							Bắt đầu ngay
						</Button>
					</a>
				{/if}

				<!-- Mobile Menu Button -->
				<button
					type="button"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors ml-1"
					aria-label="Toggle Menu"
				>
					<svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
						<path d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Dropdown -->
		{#if mobileMenuOpen}
			<div class="md:hidden px-6 py-4 bg-[#153D2B] border-t border-white/10 space-y-3 text-sm font-medium">
				<a href="#hero" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">Trang chủ</a>
				<a href="#ecosystem" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">Hệ sinh thái</a>
				<a href="#workspace" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">Trải nghiệm công cụ</a>
				<a href="#features" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">Tính năng</a>
				<a href="#library" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">Thư viện giáo án</a>
				<a href="#faq" onclick={() => (mobileMenuOpen = false)} class="block py-1 hover:text-[#F4D77A]">FAQ</a>
			</div>
		{/if}
	</header>

	<!-- ========================================================================= -->
	<!-- SECTION B: IMMERSIVE HERO WITH ANIMATED TOWN & LANDSCAPE SCENE            -->
	<!-- Inspired by reference video: Sky, clouds, pastel houses, townscape & road -->
	<!-- ========================================================================= -->
	<section id="hero" class="relative pt-32 md:pt-40 pb-36 md:pb-52 bg-[#153D2B] text-white overflow-hidden">
		
		<!-- Upper Sky Blue Area & Soft Illustrated Clouds -->
		<div class="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#77C9EE]/45 via-[#77C9EE]/15 to-transparent pointer-events-none -z-10"></div>
		
		<!-- Floating Soft Clouds -->
		<div class="absolute top-20 left-[8%] opacity-35 pointer-events-none animate-pulse duration-1000">
			<svg width="180" height="60" viewBox="0 0 180 60" fill="white">
				<path d="M20,45 Q35,20 60,30 Q85,15 110,25 Q135,10 155,30 Q175,35 170,48 Q150,55 20,45 Z" />
			</svg>
		</div>
		<div class="absolute top-32 right-[12%] opacity-30 pointer-events-none animate-pulse duration-700">
			<svg width="220" height="70" viewBox="0 0 220 70" fill="white">
				<path d="M25,50 Q45,20 80,30 Q115,10 145,25 Q175,15 200,35 Q220,45 205,58 Q150,65 25,50 Z" />
			</svg>
		</div>

		<div class="max-w-7xl mx-auto px-6 relative z-10">
			<div class="grid lg:grid-cols-12 gap-12 items-center">
				
				<!-- Hero Copy (7 cols) -->
				<div class="lg:col-span-7 space-y-6 text-center lg:text-left">
					<div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F4D77A] text-xs font-bold tracking-wider uppercase backdrop-blur-md">
						<span class="w-2 h-2 rounded-full bg-[#E97855] animate-ping"></span>
						TRỢ LÝ AI DÀNH CHO GIÁO VIÊN
					</div>

					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-[1.12] tracking-tight">
						Giáo án Việt – Anh, <br />
						<span class="text-[#F4D77A] italic">mở ra những cách dạy học mới.</span>
					</h1>

					<p class="text-base sm:text-lg text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
						Chuyển đổi giáo án tiếng Việt sang tiếng Anh chuyên ngành giáo dục, thuận tiện rà soát và hoàn thiện trước khi sử dụng.
					</p>

					<div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
						<a href={data.user ? "/dashboard" : "/login"}>
							<Button size="lg" class="h-13 px-8 text-base bg-[#E97855] hover:bg-[#d86644] text-white font-bold rounded-full shadow-xl shadow-[#E97855]/35 transition-transform hover:-translate-y-0.5">
								Chuyển đổi giáo án →
							</Button>
						</a>
						<a href="#ecosystem">
							<Button size="lg" variant="outline" class="h-13 px-8 text-base border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-md">
								Khám phá hành trình
							</Button>
						</a>
					</div>

					<p class="text-xs text-white/60 tracking-wide pt-1 flex items-center justify-center lg:justify-start gap-2">
						<span class="text-[#F4D77A]">✦</span> Từ tài liệu gốc đến giáo án song ngữ
					</p>
				</div>

				<!-- Hero Visual Scene (5 cols): Layered Illustrated Educational Campus -->
				<div class="lg:col-span-5 relative">
					<!-- Hovering Polaroid/Document Card directly matching reference video! -->
					<div class="relative w-full max-w-[440px] mx-auto rounded-3xl bg-[#FFFDF6] text-[#202820] p-6 shadow-2xl border border-black/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
						
						<!-- Polaroid Card Header -->
						<div class="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
							<div class="flex items-center gap-2">
								<span class="w-3 h-3 rounded-full bg-[#E97855]"></span>
								<span class="w-3 h-3 rounded-full bg-[#F4D77A]"></span>
								<span class="w-3 h-3 rounded-full bg-[#77C9EE]"></span>
							</div>
							<span class="text-[11px] font-bold text-[#153D2B] uppercase tracking-wider font-mono">
								CLIL TRANSFORMATION • UNIT 4
							</span>
						</div>

						<!-- Floating Illustrated Educational Transition VI -> EN -->
						<div class="space-y-3 mb-4 text-xs">
							<div class="p-3 rounded-xl bg-[#153D2B]/5 border border-[#153D2B]/10">
								<div class="flex items-center justify-between mb-1">
									<span class="font-bold text-[#153D2B] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-rose-500"></span> Bản gốc tiếng Việt
									</span>
									<span class="text-[10px] text-slate-500 font-mono">Tài liệu THCS</span>
								</div>
								<p class="font-semibold text-slate-800">
									"Mục tiêu: Học sinh mô tả cấu tạo nguyên tử gồm hạt nhân và vỏ electron."
								</p>
							</div>

							<!-- Animated arrow indicator -->
							<div class="flex items-center justify-center gap-2 text-xs font-bold text-[#E97855] py-0.5">
								<span>↓</span>
								<span class="bg-[#E97855]/15 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
									AI Educational Synthesis
								</span>
								<span>↓</span>
							</div>

							<div class="p-3 rounded-xl bg-[#E97855]/10 border border-[#E97855]/20">
								<div class="flex items-center justify-between mb-1">
									<span class="font-bold text-[#E97855] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-emerald-500"></span> English Lesson Plan (CLIL)
									</span>
									<span class="text-[10px] text-emerald-700 font-mono font-bold">Standard 5E</span>
								</div>
								<p class="font-semibold text-slate-900">
									"Objective: Students articulate atomic architecture consisting of central nucleus and electron cloud."
								</p>
							</div>
						</div>

						<!-- Floating Badges around Card -->
						<div class="flex items-center justify-between pt-2 border-t border-black/5 text-[11px] font-semibold text-[#153D2B]">
							<span class="flex items-center gap-1">
								<span>🎯</span> Chuẩn mục tiêu Bloom
							</span>
							<span class="flex items-center gap-1 text-[#E97855]">
								<span>🔊</span> IPA Audio Included
							</span>
						</div>
					</div>

					<!-- Floating decorative book badge -->
					<div class="hidden sm:flex absolute -bottom-5 -left-4 bg-[#153D2B] border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl items-center gap-2 z-20">
						<span class="text-xl">🏫</span>
						<span>Trường học số song ngữ</span>
					</div>
				</div>

			</div>
		</div>

		<!-- ========================================================================= -->
		<!-- ILLUSTRATED TOWNSCAPE / CAMPUS BOTTOM SCENERY (From Video Reference)      -->
		<!-- Pastel roofs (red, yellow, turquoise), chimney, road, pine trees           -->
		<!-- ========================================================================= -->
		<div class="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
			
			<!-- Skyline with Illustrated Buildings matching Image #1-#5 -->
			<div class="relative w-full h-32 md:h-44 flex items-end justify-between px-2 sm:px-10 opacity-95">
				
				<!-- Left Group: Red House with Chimney & Yellow Building -->
				<div class="flex items-end gap-1 sm:gap-2">
					<!-- Red House with Windows & Balcony -->
					<svg class="w-28 sm:w-44 h-24 sm:h-36 drop-shadow-md" viewBox="0 0 160 140" fill="none">
						<!-- Roof -->
						<polygon points="10,50 80,10 150,50" fill="#E97855" />
						<!-- Chimney -->
						<rect x="110" y="15" width="16" height="25" fill="#C55838" />
						<!-- Main Body -->
						<rect x="25" y="50" width="110" height="85" fill="#F8E1DC" />
						<!-- Door -->
						<rect x="65" y="90" width="30" height="45" fill="#153D2B" rx="3" />
						<!-- Windows -->
						<rect x="35" y="60" width="22" height="22" fill="#77C9EE" rx="2" />
						<rect x="100" y="60" width="22" height="22" fill="#77C9EE" rx="2" />
						<!-- Balcony railing -->
						<line x1="25" y1="85" x2="135" y2="85" stroke="#E97855" stroke-width="3" />
					</svg>

					<!-- Green Cypress Trees -->
					<svg class="w-12 sm:w-16 h-20 sm:h-28" viewBox="0 0 60 100" fill="none">
						<polygon points="30,10 10,70 50,70" fill="#24563B" />
						<polygon points="30,30 15,85 45,85" fill="#153D2B" />
						<rect x="26" y="85" width="8" height="15" fill="#8B5A2B" />
					</svg>

					<!-- Yellow Shop with Striped Awning -->
					<svg class="hidden sm:block w-36 h-32 drop-shadow-md" viewBox="0 0 140 120" fill="none">
						<!-- Yellow Body -->
						<rect x="15" y="35" width="110" height="80" fill="#F4D77A" />
						<!-- Awning -->
						<path d="M10,35 Q70,25 130,35 L125,50 Q70,42 15,50 Z" fill="#E97855" />
						<!-- Window/Display -->
						<rect x="30" y="55" width="80" height="45" fill="#77C9EE" rx="4" />
						<line x1="70" y1="55" x2="70" y2="100" stroke="#FFF" stroke-width="2" />
					</svg>
				</div>

				<!-- Center: Pathway and Little Pine Trees -->
				<div class="hidden md:flex items-end gap-3 pb-2">
					<svg class="w-10 h-20" viewBox="0 0 40 80" fill="none">
						<polygon points="20,5 5,55 35,55" fill="#24563B" />
						<polygon points="20,25 8,70 32,70" fill="#153D2B" />
						<rect x="17" y="70" width="6" height="10" fill="#6B4423" />
					</svg>
					<svg class="w-14 h-24" viewBox="0 0 50 90" fill="none">
						<circle cx="25" cy="35" r="25" fill="#3D7B56" />
						<rect x="22" y="60" width="6" height="25" fill="#6B4423" />
					</svg>
				</div>

				<!-- Right Group: Sky Blue Building & Clock Tower -->
				<div class="flex items-end gap-1 sm:gap-2">
					<!-- Blue Academy House with Arched Windows -->
					<svg class="w-28 sm:w-40 h-26 sm:h-36 drop-shadow-md" viewBox="0 0 150 130" fill="none">
						<!-- Triangular roof -->
						<polygon points="15,45 75,10 135,45" fill="#24563B" />
						<!-- Blue facade -->
						<rect x="25" y="45" width="100" height="80" fill="#CDE9F6" />
						<!-- Arched Windows -->
						<path d="M40,75 A12,12 0 0,1 64,75 L64,95 L40,95 Z" fill="#77C9EE" />
						<path d="M85,75 A12,12 0 0,1 109,75 L109,95 L85,95 Z" fill="#77C9EE" />
						<!-- Clock in gable -->
						<circle cx="75" cy="32" r="8" fill="#F4D77A" stroke="#153D2B" stroke-width="2" />
					</svg>

					<!-- Bush / Round Tree -->
					<svg class="w-12 sm:w-16 h-16 sm:h-24" viewBox="0 0 60 80" fill="none">
						<circle cx="30" cy="30" r="28" fill="#24563B" />
						<rect x="26" y="55" width="8" height="20" fill="#6B4423" />
					</svg>
				</div>
			</div>

			<!-- Organic SVG wave transition into Warm Ivory (#F7F5EA) -->
			<svg class="relative block w-full h-16 sm:h-24 text-[#F7F5EA]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
				<path d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z"></path>
			</svg>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION C: TRANSITION: FROM IDEAS TO IMPACT                               -->
	<!-- Flowing landscape, 3 asymmetric educational objects & pathway             -->
	<!-- ========================================================================= -->
	<section id="transition-section" class="py-24 bg-[#F7F5EA] relative">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					TỪ Ý TƯỞNG ĐẾN BÀI GIẢNG
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Mỗi giáo án là một hành trình học tập.
				</h2>
				<p class="text-base text-[#72786F] leading-relaxed font-light max-w-xl mx-auto">
					Ngôn ngữ không nên là rào cản khi giáo viên muốn chia sẻ kiến thức, đổi mới hoạt động dạy học và xây dựng tài liệu song ngữ.
				</p>
			</div>

			<!-- Three Large Illustrated Educational Objects in Asymmetric Flow -->
			<div class="grid md:grid-cols-3 gap-8 relative">
				
				<!-- Object 1: Miniature School -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
					<div>
						<!-- Bespoke Illustrated Miniature School Building -->
						<div class="w-18 h-18 rounded-2xl bg-[#153D2B]/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
							<svg class="w-10 h-10" viewBox="0 0 64 64" fill="none">
								<polygon points="8,26 32,10 56,26" fill="#E97855" />
								<rect x="14" y="26" width="36" height="30" fill="#153D2B" rx="2" />
								<rect x="26" y="38" width="12" height="18" fill="#F4D77A" rx="2" />
								<rect x="18" y="30" width="8" height="8" fill="#77C9EE" rx="1" />
								<rect x="38" y="30" width="8" height="8" fill="#77C9EE" rx="1" />
								<polygon points="32,4 28,10 36,10" fill="#F4D77A" />
							</svg>
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">01. Chuẩn bị bài dạy</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Nguyên bản giáo án</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							Tài liệu sẵn có từ sách giáo khoa, bài giảng thuyết trình hoặc kế hoạch bài dạy tiếng Việt của nhà trường theo khung chuẩn GDPT.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold flex items-center gap-1.5">
						<span>✦</span> Giữ trọn vẹn mục tiêu kiến thức
					</div>
				</div>

				<!-- Object 2: Open Educational Book -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
					<div>
						<!-- Bespoke Illustrated Open Book -->
						<div class="w-18 h-18 rounded-2xl bg-[#77C9EE]/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
							<svg class="w-10 h-10" viewBox="0 0 64 64" fill="none">
								<path d="M32,20 C24,14 12,16 6,18 L6,50 C12,48 24,46 32,52 C40,46 52,48 58,50 L58,18 C52,16 40,14 32,20 Z" fill="#FFFDF6" stroke="#153D2B" stroke-width="2.5" />
								<line x1="32" y1="20" x2="32" y2="52" stroke="#153D2B" stroke-width="2.5" />
								<line x1="12" y1="26" x2="26" y2="28" stroke="#E97855" stroke-width="2" stroke-linecap="round" />
								<line x1="12" y1="34" x2="24" y2="36" stroke="#24563B" stroke-width="2" stroke-linecap="round" />
								<line x1="38" y1="28" x2="52" y2="26" stroke="#77C9EE" stroke-width="2" stroke-linecap="round" />
								<line x1="40" y1="36" x2="52" y2="34" stroke="#F4D77A" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">02. Chuyển hóa sư phạm</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Tái cấu trúc CLIL</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							AI tự động phân tách chuỗi hoạt động của giáo viên và học sinh, dịch chuyển ngữ học thuật phù hợp lứa tuổi và phương pháp 5E.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold flex items-center gap-1.5">
						<span>✦</span> Bám sát 4 thành tố CLIL quốc tế
					</div>
				</div>

				<!-- Object 3: Bilingual Document Result -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
					<div>
						<!-- Bespoke Illustrated Bilingual Plan -->
						<div class="w-18 h-18 rounded-2xl bg-[#E97855]/15 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
							<svg class="w-10 h-10" viewBox="0 0 64 64" fill="none">
								<rect x="14" y="10" width="36" height="46" rx="3" fill="#FFFDF6" stroke="#E97855" stroke-width="2.5" />
								<polygon points="38,10 50,22 38,22" fill="#F4D77A" stroke="#E97855" stroke-width="2" />
								<circle cx="24" cy="22" r="4" fill="#24563B" />
								<line x1="20" y1="32" x2="44" y2="32" stroke="#153D2B" stroke-width="2.5" stroke-linecap="round" />
								<line x1="20" y1="40" x2="40" y2="40" stroke="#77C9EE" stroke-width="2" stroke-linecap="round" />
								<line x1="20" y1="46" x2="34" y2="46" stroke="#77C9EE" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
						<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider">03. Hoàn thiện tài liệu</span>
						<h3 class="text-xl font-bold font-serif text-[#153D2B] mt-1 mb-3">Giáo án song ngữ</h3>
						<p class="text-sm text-[#72786F] leading-relaxed">
							Bộ tài liệu tiếng Anh hoàn thiện kèm thẻ từ vựng phát âm chuẩn xác, sẵn sàng đem lên lớp giảng dạy hoặc xuất file Word.
						</p>
					</div>
					<div class="mt-6 pt-4 border-t border-black/5 text-xs text-[#24563B] font-semibold flex items-center gap-1.5">
						<span>✦</span> Xuất file .docx chuẩn A4 in ấn
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION D: THE TRANSLATION ECOSYSTEM (Connected Isometric Diagram)        -->
	<!-- Inspired by the miniature buildings & winding road in reference video     -->
	<!-- ========================================================================= -->
	<section id="ecosystem" class="py-24 bg-[#FFFDF6] border-y border-[#202820]/10 relative overflow-hidden">
		<div class="max-w-6xl mx-auto px-6 relative">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#E97855]">
					HỆ SINH THÁI CHUYỂN ĐỔI
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Một quy trình, nhiều giá trị cho giáo viên.
				</h2>
				<p class="text-base text-[#72786F] max-w-xl mx-auto font-light">
					Hệ sinh thái kết nối 4 trạm thông minh qua con đường sư phạm liền mạch, giúp giáo án từ ý tưởng đến bài dạy hoàn chỉnh.
				</p>
			</div>

			<!-- Winding Road Graphic (Desktop only) -->
			<div class="hidden lg:block absolute top-[280px] inset-x-12 h-6 -z-0 pointer-events-none">
				<svg class="w-full h-10 text-[#EAA088]/40" viewBox="0 0 1000 40" fill="none">
					<path d="M0,20 Q250,5 500,20 T1000,20" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-dasharray="8 8" />
				</svg>
			</div>

			<!-- 4 Connected Isometric Stations -->
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
				
				<!-- Station 1 -->
				<div class="p-6 rounded-3xl bg-[#F7F5EA] border border-[#153D2B]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
					<div class="space-y-4">
						<!-- Isometric Miniature Schoolhouse -->
						<div class="w-16 h-16 rounded-2xl bg-[#153D2B] text-white flex items-center justify-center p-3 shadow-md shadow-[#153D2B]/20">
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none">
								<path d="M24,4 L4,14 L24,24 L44,14 Z" fill="#E97855" />
								<path d="M4,14 L24,24 L24,44 L4,34 Z" fill="#24563B" />
								<path d="M44,14 L24,24 L24,44 L44,34 Z" fill="#153D2B" />
								<rect x="28" y="27" width="8" height="10" fill="#F4D77A" />
							</svg>
						</div>

						<div>
							<span class="text-[10px] font-bold uppercase tracking-wider text-[#E97855]">Trạm 01</span>
							<h4 class="font-serif font-bold text-lg text-[#153D2B]">Chuẩn bị giáo án</h4>
						</div>

						<p class="text-xs text-[#72786F] leading-relaxed">
							Tải lên tài liệu dạng PDF, Word hoặc dán trực tiếp kế hoạch bài dạy tiếng Việt theo khung phân phối chương trình.
						</p>
					</div>

					<div class="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#24563B]">
						<span>Trạm thu nhận</span>
						<span>➔</span>
					</div>
				</div>

				<!-- Station 2 -->
				<div class="p-6 rounded-3xl bg-[#F7F5EA] border border-[#153D2B]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
					<div class="space-y-4">
						<!-- Isometric Educational Analysis Workspace -->
						<div class="w-16 h-16 rounded-2xl bg-[#24563B] text-white flex items-center justify-center p-3 shadow-md shadow-[#24563B]/20">
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none">
								<path d="M24,4 L4,14 L24,24 L44,14 Z" fill="#77C9EE" />
								<path d="M4,14 L24,24 L24,44 L4,34 Z" fill="#153D2B" />
								<path d="M44,14 L24,24 L24,44 L44,34 Z" fill="#24563B" />
								<circle cx="24" cy="14" r="5" fill="#F4D77A" />
							</svg>
						</div>

						<div>
							<span class="text-[10px] font-bold uppercase tracking-wider text-[#E97855]">Trạm 02</span>
							<h4 class="font-serif font-bold text-lg text-[#153D2B]">Phân tích nội dung</h4>
						</div>

						<p class="text-xs text-[#72786F] leading-relaxed">
							Bóc tách mục tiêu năng lực, chuỗi hoạt động 5E (Khám phá - Luyện tập - Vận dụng) và danh mục thuật ngữ khoa học.
						</p>
					</div>

					<div class="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#24563B]">
						<span>Trạm giải mã</span>
						<span>➔</span>
					</div>
				</div>

				<!-- Station 3 -->
				<div class="p-6 rounded-3xl bg-[#F7F5EA] border border-[#153D2B]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
					<div class="space-y-4">
						<!-- Isometric Bilingual Transformation Tower -->
						<div class="w-16 h-16 rounded-2xl bg-[#E97855] text-white flex items-center justify-center p-3 shadow-md shadow-[#E97855]/20">
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none">
								<path d="M24,4 L4,14 L24,24 L44,14 Z" fill="#F4D77A" />
								<path d="M4,14 L24,24 L24,44 L4,34 Z" fill="#C55838" />
								<path d="M44,14 L24,24 L24,44 L44,34 Z" fill="#E97855" />
								<rect x="12" y="22" width="6" height="8" fill="#FFF" />
								<rect x="30" y="22" width="6" height="8" fill="#FFF" />
							</svg>
						</div>

						<div>
							<span class="text-[10px] font-bold uppercase tracking-wider text-[#E97855]">Trạm 03</span>
							<h4 class="font-serif font-bold text-lg text-[#153D2B]">Chuyển đổi Việt – Anh</h4>
						</div>

						<p class="text-xs text-[#72786F] leading-relaxed">
							Tái tạo văn phong giáo án chuẩn quốc tế, sinh thẻ từ vựng với phiên âm IPA và audio giọng đọc tự nhiên.
						</p>
					</div>

					<div class="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#24563B]">
						<span>Trạm ngôn ngữ</span>
						<span>➔</span>
					</div>
				</div>

				<!-- Station 4 -->
				<div class="p-6 rounded-3xl bg-[#F7F5EA] border border-[#153D2B]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
					<div class="space-y-4">
						<!-- Isometric Teacher Review Studio -->
						<div class="w-16 h-16 rounded-2xl bg-[#77C9EE] text-[#153D2B] flex items-center justify-center p-3 shadow-md shadow-[#77C9EE]/20">
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none">
								<path d="M24,4 L4,14 L24,24 L44,14 Z" fill="#153D2B" />
								<path d="M4,14 L24,24 L24,44 L4,34 Z" fill="#58B2DB" />
								<path d="M44,14 L24,24 L24,44 L44,34 Z" fill="#77C9EE" />
								<circle cx="24" cy="24" r="6" fill="#F4D77A" />
							</svg>
						</div>

						<div>
							<span class="text-[10px] font-bold uppercase tracking-wider text-[#E97855]">Trạm 04</span>
							<h4 class="font-serif font-bold text-lg text-[#153D2B]">Rà soát & hoàn thiện</h4>
						</div>

						<p class="text-xs text-[#72786F] leading-relaxed">
							Giáo viên chủ động hiệu đính, lưu vào thư viện giảng dạy và xuất file Word chuẩn chỉnh sẵn sàng đem lên lớp.
						</p>
					</div>

					<div class="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#24563B]">
						<span>Hoàn thiện</span>
						<span>✓</span>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION E: THE ACTUAL PRODUCT (Interactive Demo Workspace)                -->
	<!-- Real usable dual-panel translation workspace embedded naturally           -->
	<!-- ========================================================================= -->
	<section id="workspace" class="py-24 bg-[#F7F5EA]">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-12 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					TRẢI NGHIỆM CÔNG CỤ
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Thử chuyển đổi một đoạn giáo án của bạn.
				</h2>
				<p class="text-base text-[#72786F] font-light">
					Thử nghiệm ngay quy trình dịch thuật ngữ sư phạm trực quan qua 5 môn học Khoa học Tự nhiên.
				</p>
			</div>

			<!-- Workspace Card Container -->
			<div class="rounded-3xl bg-[#FFFDF6] border border-[#202820]/15 shadow-xl p-6 lg:p-10">
				
				<!-- Controls Bar -->
				<div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#202820]/10">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-xs font-bold text-[#153D2B]">Môn học:</span>
						{#each ['Tin học', 'Toán học', 'Vật lí', 'Hóa học', 'Sinh học'] as sub}
							<button
								type="button"
								onclick={() => handleSubjectChange(sub)}
								class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer {selectedSubject === sub ? 'bg-[#153D2B] text-white shadow-sm' : 'bg-[#F7F5EA] text-[#202820] hover:bg-[#153D2B]/10'}"
							>
								{sub}
							</button>
						{/each}
					</div>

					<div class="flex items-center gap-2 text-xs">
						<span class="text-[#72786F] font-medium">Văn phong:</span>
						<span class="px-3 py-1 rounded-full bg-[#E97855]/15 text-[#E97855] font-bold">
							Theo văn phong giáo án CLIL
						</span>
					</div>
				</div>

				<!-- Dual-Panel Grid -->
				<div class="grid lg:grid-cols-2 gap-8 pt-8">
					
					<!-- Left: Vietnamese Source -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<label for="vi-source" class="text-xs font-bold uppercase tracking-wider text-[#153D2B] flex items-center gap-2">
								<span>🇻🇳</span> Giáo án tiếng Việt
							</label>
							<span class="text-[11px] text-[#72786F] font-medium">{demoPresets[selectedSubject]?.grade}</span>
						</div>
						<textarea
							id="vi-source"
							bind:value={sourceText}
							rows="11"
							class="w-full rounded-2xl border border-[#202820]/15 bg-[#F7F5EA]/60 p-4 text-xs sm:text-sm font-sans leading-relaxed text-[#202820] focus:ring-2 focus:ring-[#153D2B] focus:outline-none resize-none"
							placeholder="Nhập mục tiêu, hoạt động khởi động hoặc bài tập..."
						></textarea>
					</div>

					<!-- Right: English Output -->
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<label for="en-result" class="text-xs font-bold uppercase tracking-wider text-[#153D2B] flex items-center gap-2">
								<span>🇬🇧</span> English lesson plan
							</label>
							<button
								type="button"
								onclick={handleCopy}
								class="text-xs text-[#24563B] hover:text-[#153D2B] font-bold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-black/10 shadow-xs"
							>
								{copied ? '✓ Đã sao chép!' : '📋 Sao chép'}
							</button>
						</div>

						<div class="relative">
							<textarea
								id="en-result"
								readonly
								value={resultText}
								rows="11"
								class="w-full rounded-2xl border border-[#202820]/15 bg-[#FFFDF6] p-4 text-xs sm:text-sm font-sans leading-relaxed text-[#202820] focus:outline-none resize-none {isTranslating ? 'opacity-40' : ''}"
							></textarea>
							
							{#if isTranslating}
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="px-5 py-2.5 rounded-full bg-[#153D2B] text-white text-xs font-semibold shadow-xl flex items-center gap-2.5">
										<span class="w-3.5 h-3.5 border-2 border-[#F4D77A] border-t-transparent rounded-full animate-spin"></span>
										Đang dịch và chuẩn hóa cấu trúc...
									</div>
								</div>
							{/if}
						</div>

						<!-- Extracted Vocabulary Tags -->
						<div class="p-3.5 rounded-2xl bg-[#F7F5EA] border border-black/5">
							<span class="text-[11px] font-bold text-[#153D2B] uppercase tracking-wider block mb-2">
								Từ vựng chuyên ngành được trích xuất:
							</span>
							<div class="flex flex-wrap gap-2">
								{#each currentVocab as item}
									<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-black/5 text-xs text-[#202820]">
										<span class="font-bold text-[#E97855]">{item.word}</span>
										<span class="text-[#72786F] font-mono text-[10px]">{item.ipa}</span>
										<span class="text-slate-500">• {item.vi}</span>
									</span>
								{/each}
							</div>
						</div>
					</div>

				</div>

				<!-- Center Action Bar -->
				<div class="mt-8 pt-6 border-t border-[#202820]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="flex items-center gap-2 text-xs text-[#72786F]">
						<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
						Chế độ demo tương tác (Demonstration mode)
					</div>

					<Button
						onclick={handleTranslate}
						disabled={isTranslating}
						class="w-full sm:w-auto px-8 h-12 bg-[#E97855] hover:bg-[#d86644] text-white font-bold rounded-full shadow-lg shadow-[#E97855]/25 cursor-pointer text-sm"
					>
						Chuyển sang tiếng Anh →
					</Button>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION F: WHAT MAKES IT USEFUL (Editorial Split Section)                 -->
	<!-- Large illustrated open lesson plan with colored pedagogical annotations   -->
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
						<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B] leading-tight">
							Không chỉ là dịch ngôn ngữ. <br />
							<span class="italic text-[#24563B]">Đó là giữ trọn ý tưởng bài giảng.</span>
						</h2>
					</div>

					<div class="space-y-6">
						<div class="flex gap-4">
							<div class="w-11 h-11 rounded-2xl bg-[#153D2B]/10 text-[#153D2B] flex items-center justify-center font-bold text-lg flex-shrink-0">
								1
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-base text-[#153D2B]">Thuật ngữ giáo dục phù hợp</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Translate objectives, classroom activities, and assessment language with strict attention to international educational context.
								</p>
							</div>
						</div>

						<div class="flex gap-4">
							<div class="w-11 h-11 rounded-2xl bg-[#77C9EE]/25 text-[#153D2B] flex items-center justify-center font-bold text-lg flex-shrink-0">
								2
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-base text-[#153D2B]">Cấu trúc giáo án dễ theo dõi</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Preserve headings, tables, teacher-student dual column matrices, and the logical order of the original curricular document.
								</p>
							</div>
						</div>

						<div class="flex gap-4">
							<div class="w-11 h-11 rounded-2xl bg-[#E97855]/15 text-[#E97855] flex items-center justify-center font-bold text-lg flex-shrink-0">
								3
							</div>
							<div class="space-y-1">
								<h3 class="font-bold text-base text-[#153D2B]">Chủ động rà soát & hoàn thiện</h3>
								<p class="text-sm text-[#72786F] leading-relaxed">
									Let educators inspect, edit, and listen to authentic IPA audio guide before deploying materials in real bilingual classrooms.
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Illustrated Card (6 cols) -->
				<div class="lg:col-span-6">
					<div class="rounded-3xl bg-[#F7F5EA] p-8 border border-[#153D2B]/15 shadow-xl relative overflow-hidden">
						<!-- Decorative corner badges -->
						<div class="flex items-center justify-between border-b border-black/10 pb-4 mb-5">
							<span class="text-xs font-bold uppercase tracking-wider text-[#24563B]">Bản xem trước cấu trúc chuẩn</span>
							<span class="px-3 py-1 rounded-full bg-[#E97855] text-white text-[11px] font-bold">Word .docx Ready</span>
						</div>

						<div class="space-y-3 font-mono text-xs">
							<div class="p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
								<p class="text-[#153D2B] font-bold"># I. OBJECTIVES (Mục tiêu bài dạy)</p>
								<p class="text-slate-600 mt-1">1. Knowledge: Describe properties of chemical compounds...</p>
								<p class="text-slate-600">2. Competences: Scientific reasoning & collaborative inquiry...</p>
							</div>

							<div class="p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
								<p class="text-[#153D2B] font-bold"># II. TEACHING & LEARNING ACTIVITIES</p>
								<p class="text-slate-600 mt-1">Activity 1: Warm-up & Prior knowledge retrieval (7 mins)</p>
								<p class="text-slate-600">Activity 2: Experiential lab investigation (20 mins)</p>
							</div>

							<div class="p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
								<p class="text-[#E97855] font-bold"># III. SCIENTIFIC VOCABULARY & IPA</p>
								<p class="text-slate-600 mt-1">✦ Photosynthesis /ˌfəʊtəʊˈsɪnθəsɪs/: Quang hợp</p>
								<p class="text-slate-600">✦ Chloroplast /ˈklɔːrəplæst/: Lục lạp</p>
							</div>
						</div>

						<div class="mt-4 pt-3 border-t border-black/5 text-[11px] text-[#72786F] flex items-center justify-between">
							<span>Tương thích Microsoft Word & Google Docs</span>
							<span class="text-emerald-700 font-bold">Tự động căn chỉnh lề A4</span>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION G: HOW IT WORKS (3 Simple Steps with Isometric Illustrations)     -->
	<!-- ========================================================================= -->
	<section class="py-24 bg-[#F7F5EA]">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					BA BƯỚC ĐƠN GIẢN
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Bắt đầu từ giáo án bạn đã có.
				</h2>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				
				<!-- Step 01 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4 hover:-translate-y-1 transition-transform">
					<div class="w-16 h-16 mx-auto rounded-2xl bg-[#153D2B] text-white flex items-center justify-center p-3 shadow-md shadow-[#153D2B]/20">
						<svg class="w-9 h-9" viewBox="0 0 40 40" fill="none">
							<rect x="8" y="6" width="24" height="28" rx="3" fill="#FFF" stroke="#E97855" stroke-width="2" />
							<path d="M20,14 L20,26 M15,20 L20,14 L25,20" stroke="#153D2B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider block">Bước 01</span>
					<h3 class="text-xl font-bold font-serif text-[#153D2B]">Tải tài liệu</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed font-light">
						Chọn tệp giáo án có sẵn ở định dạng Word, PDF hoặc hình ảnh tài liệu soạn giảng tiếng Việt.
					</p>
				</div>

				<!-- Step 02 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4 hover:-translate-y-1 transition-transform">
					<div class="w-16 h-16 mx-auto rounded-2xl bg-[#E97855] text-white flex items-center justify-center p-3 shadow-md shadow-[#E97855]/20">
						<svg class="w-9 h-9" viewBox="0 0 40 40" fill="none">
							<circle cx="20" cy="20" r="14" fill="#F4D77A" stroke="#FFF" stroke-width="2" />
							<polygon points="20,10 24,18 32,20 26,26 27,34 20,30 13,34 14,26 8,20 16,18" fill="#E97855" />
						</svg>
					</div>
					<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider block">Bước 02</span>
					<h3 class="text-xl font-bold font-serif text-[#153D2B]">Chọn cách chuyển đổi</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed font-light">
						Chọn môn học, văn phong sư phạm và số lượng tiết học dự kiến cho bài dạy (45 phút/tiết).
					</p>
				</div>

				<!-- Step 03 -->
				<div class="p-8 rounded-3xl bg-[#FFFDF6] border border-[#202820]/10 shadow-sm text-center space-y-4 hover:-translate-y-1 transition-transform">
					<div class="w-16 h-16 mx-auto rounded-2xl bg-[#77C9EE] text-[#153D2B] flex items-center justify-center p-3 shadow-md shadow-[#77C9EE]/20">
						<svg class="w-9 h-9" viewBox="0 0 40 40" fill="none">
							<rect x="8" y="8" width="24" height="24" rx="4" fill="#153D2B" />
							<path d="M14,20 L18,24 L26,16" stroke="#F4D77A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<span class="text-xs font-bold text-[#E97855] uppercase tracking-wider block">Bước 03</span>
					<h3 class="text-xl font-bold font-serif text-[#153D2B]">Rà soát & hoàn thiện</h3>
					<p class="text-xs sm:text-sm text-[#72786F] leading-relaxed font-light">
						Kiểm tra trước bản tiếng Anh, nghe phát âm IPA của thuật ngữ và xuất file Word hoàn chỉnh.
					</p>
				</div>

			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION H: LESSON PLAN LIBRARY (Curated Editorial Cards)                  -->
	<!-- Document-cover styling with subtle paper textures and subject colors      -->
	<!-- ========================================================================= -->
	<section id="library" class="py-24 bg-[#FFFDF6] border-t border-[#202820]/10">
		<div class="max-w-6xl mx-auto px-6">
			
			<div class="max-w-2xl mx-auto text-center mb-12 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#E97855]">
					KHÁM PHÁ THƯ VIỆN
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Những mẫu giáo án truyền cảm hứng.
				</h2>
				<p class="text-sm text-[#72786F]">
					Tuyển tập các kế hoạch bài dạy song ngữ mẫu theo chuẩn chương trình GDPT mới.
				</p>
			</div>

			<!-- Category Filter Pills -->
			<div class="flex flex-wrap items-center justify-center gap-2 mb-10">
				{#each ['Tất cả', 'Tin học', 'Toán học', 'Khoa học tự nhiên', 'Giáo án song ngữ'] as cat}
					<button
						type="button"
						onclick={() => (libraryFilter = cat)}
						class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer {libraryFilter === cat ? 'bg-[#153D2B] text-white shadow-sm' : 'bg-[#F7F5EA] text-[#202820] hover:bg-[#153D2B]/10'}"
					>
						{cat}
					</button>
				{/each}
			</div>

			<!-- Grid of Editorial Cards -->
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each filteredLibrary as item}
					<div class="p-6 rounded-3xl bg-[#F7F5EA] border border-[#202820]/10 flex flex-col justify-between hover:-translate-y-1.5 transition-transform shadow-xs">
						<div class="space-y-3">
							<span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider {item.badgeColor}">
								{item.grade}
							</span>
							<h4 class="font-serif font-bold text-lg text-[#153D2B] leading-snug">
								{item.title}
							</h4>
							<p class="text-xs text-[#72786F] leading-relaxed">
								{item.summary}
							</p>
						</div>

						<div class="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[#24563B]">
							<span>{item.time} • {item.pages}</span>
							<span class="text-[#E97855]">Xem mẫu →</span>
						</div>
					</div>
				{/each}
			</div>

		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- SECTION I: FAQ ACCORDION                                                  -->
	<!-- Simple accordion on warm ivory background                                 -->
	<!-- ========================================================================= -->
	<section id="faq" class="py-24 bg-[#F7F5EA]">
		<div class="max-w-4xl mx-auto px-6">
			
			<div class="text-center mb-16 space-y-3">
				<span class="text-xs font-bold uppercase tracking-widest text-[#24563B]">
					GIẢI ĐÁP THẮC MẮC
				</span>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#153D2B]">
					Câu hỏi thường gặp
				</h2>
			</div>

			<div class="space-y-4">
				{#each faqs as faq, i}
					<div class="rounded-2xl bg-[#FFFDF6] border border-[#202820]/10 overflow-hidden shadow-xs transition-all">
						<button
							type="button"
							onclick={() => toggleFaq(i)}
							class="w-full p-5 text-left font-bold text-sm sm:text-base text-[#153D2B] flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.02]"
						>
							<span>{faq.q}</span>
							<span class="w-6 h-6 rounded-full bg-[#153D2B]/10 text-[#153D2B] flex items-center justify-center text-xs flex-shrink-0 font-mono">
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
	<!-- Memorable closing section: Deep-green, terracotta accent, warm interior    -->
	<!-- ========================================================================= -->
	<section class="py-24 bg-[#153D2B] text-white relative overflow-hidden">
		<!-- Organic background glowing landscape -->
		<div class="absolute -top-32 -left-32 w-96 h-96 bg-[#24563B] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
		<div class="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E97855]/30 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

		<div class="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
			<!-- Visual Icon -->
			<div class="w-16 h-16 mx-auto rounded-3xl bg-[#E97855] flex items-center justify-center text-3xl shadow-xl shadow-[#E97855]/30">
				🌱
			</div>

			<h2 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
				Cùng mở rộng không gian <br />
				<span class="text-[#F4D77A] italic">cho những bài giảng tốt hơn.</span>
			</h2>

			<p class="text-base sm:text-lg text-white/80 max-w-xl mx-auto font-light leading-relaxed">
				Bắt đầu từ một giáo án tiếng Việt và khám phá cách bạn có thể chuẩn bị phiên bản tiếng Anh.
			</p>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
				<a href="#workspace">
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
	<!-- Clean ivory footer with EduTranslate logo, navigation & description       -->
	<!-- ========================================================================= -->
	<footer class="py-12 bg-[#F7F5EA] border-t border-[#202820]/10 text-xs text-[#72786F]">
		<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-xl bg-[#153D2B] text-white flex items-center justify-center font-bold text-sm">
					E
				</div>
				<div>
					<p class="font-bold text-[#153D2B] text-sm font-serif">EduTranslate</p>
					<p class="text-[11px]">Nền tảng hỗ trợ chuyển đổi giáo án song ngữ cho giáo viên Việt Nam.</p>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-6 font-medium">
				<a href="#hero" class="hover:text-[#153D2B] transition-colors">Trang chủ</a>
				<a href="#features" class="hover:text-[#153D2B] transition-colors">Tính năng</a>
				<a href="#ecosystem" class="hover:text-[#153D2B] transition-colors">Cách hoạt động</a>
				<a href="#workspace" class="hover:text-[#153D2B] transition-colors">Trải nghiệm</a>
				<a href="#library" class="hover:text-[#153D2B] transition-colors">Thư viện</a>
				<a href="#faq" class="hover:text-[#153D2B] transition-colors">FAQ</a>
				<a href="/login" class="hover:text-[#153D2B] transition-colors">Đăng nhập</a>
			</div>
		</div>

		<div class="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-black/5 text-center text-[11px] text-[#72786F]/80">
			© 2026 EduTranslate. Tất cả quyền được bảo lưu. Thiết kế dành riêng cho cộng đồng giáo viên song ngữ Việt Nam.
		</div>
	</footer>

</div>

import {
	AlignmentType,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	TextRun,
	UnderlineType,
	WidthType
} from 'docx';

interface InlineStyle {
	bold?: boolean;
	italics?: boolean;
	underline?: (typeof UnderlineType)[keyof typeof UnderlineType];
}

interface InlineSegment {
	text?: string;
	style: InlineStyle;
	isBreak?: boolean;
	isEquation?: boolean;
}

interface EquationRunSpec {
	text: string;
	bold?: boolean;
	italics?: boolean;
	underline?: (typeof UnderlineType)[keyof typeof UnderlineType];
	superScript?: boolean;
	subScript?: boolean;
}

interface MarkdownToDocxOptions {
	fontFamily?: string;
	font?: string;
	normalSize?: number;
	headingSizes?: Partial<Record<number, number>>;
}

interface ParagraphContext {
	fontFamily: string;
	size: number;
	headingLevel?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
	align?: (typeof AlignmentType)[keyof typeof AlignmentType];
	isFirstBlock?: boolean;
}

const DEFAULT_FONT_FAMILY = 'Times New Roman';
const DEFAULT_NORMAL_SIZE = 24;
const DEFAULT_HEADING_SIZES: Record<number, number> = {
	1: 40,
	2: 32,
	3: 28,
	4: 26,
	5: 24,
	6: 22
};
const TABLE_HEADER_FILL = 'E2E8F0';
const TABLE_CELL_MARGIN = 160;

const headingLevelMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
	1: HeadingLevel.HEADING_1,
	2: HeadingLevel.HEADING_2,
	3: HeadingLevel.HEADING_3,
	4: HeadingLevel.HEADING_4,
	5: HeadingLevel.HEADING_5,
	6: HeadingLevel.HEADING_6
};

const markerDefinitions: Array<{ marker: string; style: InlineStyle }> = [
	{ marker: '***', style: { bold: true, italics: true } },
	{ marker: '___', style: { italics: true, underline: UnderlineType.SINGLE } },
	{ marker: '**', style: { bold: true } },
	{ marker: '__', style: { underline: UnderlineType.SINGLE } },
	{ marker: '*', style: { italics: true } },
	{ marker: '_', style: { italics: true } }
];

const breakPattern = /<br\s*\/?>(?![^<]*>)/gi;
const alphaListPattern = /^[a-z]\.\s+/i;

const latexReplacements: Array<{
	pattern: RegExp;
	replace: string | ((...args: string[]) => string);
}> = [
	{
		pattern: /\\text\s*\{([^}]*)\}/g,
		replace: (_, text) => text
	},
	{
		pattern: /\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g,
		replace: (_, numerator, denominator) => `${numerator}/${denominator}`
	},
	{
		pattern: /([^{\s]+|\{[^}]+\})\s*\^\s*(\{[^}]+\}|[^\s{}]+)/g,
		replace: (_, base, exponent) => {
			const cleanBase = base.startsWith('{') && base.endsWith('}') ? base.slice(1, -1) : base;
			const cleanExponent = exponent.startsWith('{') && exponent.endsWith('}') ? exponent.slice(1, -1) : exponent;
			return `${cleanBase}^{${cleanExponent}}`;
		}
	},
	{
		pattern: /([^{\s]+|\{[^}]+\})\s*\/\s*(\{[^}]+\}|[^\s{}]+)/g,
		replace: (_, numerator, denominator) => {
			const cleanNumerator = numerator.startsWith('{') && numerator.endsWith('}') ? numerator.slice(1, -1) : numerator;
			const cleanDenominator = denominator.startsWith('{') && denominator.endsWith('}') ? denominator.slice(1, -1) : denominator;
			return `${cleanNumerator}/${cleanDenominator}`;
		}
	},
	{ pattern: /\\cdot/g, replace: '⋅' },
	{ pattern: /\\times/g, replace: '×' },
	{ pattern: /\\sin\b/g, replace: 'sin' },
	{ pattern: /\\cos\b/g, replace: 'cos' },
	{ pattern: /\\tan\b/g, replace: 'tan' },
	{ pattern: /\\ln\b/g, replace: 'ln' },
	{ pattern: /\\log\b/g, replace: 'log' },
	{ pattern: /\\sqrt\s*\{([^}]*)\}/g, replace: (_, value) => `√(${value})` },
	{ pattern: /\\sqrt\[([^\]]+)\]\s*\{([^}]*)\}/g, replace: (_, root, value) => `${root}√(${value})` },
	{ pattern: /\\leq/g, replace: '≤' },
	{ pattern: /\\geq/g, replace: '≥' },
	{ pattern: /\\neq/g, replace: '≠' },
	{ pattern: /\\approx/g, replace: '≈' },
	{ pattern: /\\equiv/g, replace: '≡' },
	{ pattern: /\\pm/g, replace: '±' },
	{ pattern: /\\mp/g, replace: '∓' },
	{ pattern: /\\sum/g, replace: '∑' },
	{ pattern: /\\prod/g, replace: '∏' },
	{ pattern: /\\int/g, replace: '∫' },
	{ pattern: /\\oint/g, replace: '∮' },
	{ pattern: /\\partial/g, replace: '∂' },
	{ pattern: /\\nabla/g, replace: '∇' },
	{ pattern: /\\infty/g, replace: '∞' },
	{ pattern: /\\alpha/g, replace: 'α' },
	{ pattern: /\\beta/g, replace: 'β' },
	{ pattern: /\\gamma/g, replace: 'γ' },
	{ pattern: /\\Gamma/g, replace: 'Γ' },
	{ pattern: /\\delta/g, replace: 'δ' },
	{ pattern: /\\Delta/g, replace: 'Δ' },
	{ pattern: /\\epsilon/g, replace: 'ε' },
	{ pattern: /\\varepsilon/g, replace: 'ε' },
	{ pattern: /\\zeta/g, replace: 'ζ' },
	{ pattern: /\\eta/g, replace: 'η' },
	{ pattern: /\\theta/g, replace: 'θ' },
	{ pattern: /\\Theta/g, replace: 'Θ' },
	{ pattern: /\\vartheta/g, replace: 'θ' },
	{ pattern: /\\iota/g, replace: 'ι' },
	{ pattern: /\\kappa/g, replace: 'κ' },
	{ pattern: /\\lambda/g, replace: 'λ' },
	{ pattern: /\\Lambda/g, replace: 'Λ' },
	{ pattern: /\\mu/g, replace: 'μ' },
	{ pattern: /\\nu/g, replace: 'ν' },
	{ pattern: /\\xi/g, replace: 'ξ' },
	{ pattern: /\\Xi/g, replace: 'Ξ' },
	{ pattern: /\\pi/g, replace: 'π' },
	{ pattern: /\\Pi/g, replace: 'Π' },
	{ pattern: /\\rho/g, replace: 'ρ' },
	{ pattern: /\\sigma/g, replace: 'σ' },
	{ pattern: /\\Sigma/g, replace: 'Σ' },
	{ pattern: /\\tau/g, replace: 'τ' },
	{ pattern: /\\upsilon/g, replace: 'υ' },
	{ pattern: /\\Upsilon/g, replace: 'Υ' },
	{ pattern: /\\phi/g, replace: 'φ' },
	{ pattern: /\\Phi/g, replace: 'Φ' },
	{ pattern: /\\varphi/g, replace: 'φ' },
	{ pattern: /\\chi/g, replace: 'χ' },
	{ pattern: /\\psi/g, replace: 'ψ' },
	{ pattern: /\\Psi/g, replace: 'Ψ' },
	{ pattern: /\\omega/g, replace: 'ω' },
	{ pattern: /\\Omega/g, replace: 'Ω' },
	{ pattern: /\\rightarrow/g, replace: '→' },
	{ pattern: /\\Rightarrow/g, replace: '⇒' },
	{ pattern: /\\leftarrow/g, replace: '←' },
	{ pattern: /\\Leftarrow/g, replace: '⇐' },
	{ pattern: /\\leftrightarrow/g, replace: '↔' },
	{ pattern: /\\Leftrightarrow/g, replace: '⇔' },
	{ pattern: /\\to/g, replace: '→' },
	{ pattern: /\\in/g, replace: '∈' },
	{ pattern: /\\notin/g, replace: '∉' },
	{ pattern: /\\subset/g, replace: '⊂' },
	{ pattern: /\\subseteq/g, replace: '⊆' },
	{ pattern: /\\supset/g, replace: '⊃' },
	{ pattern: /\\supseteq/g, replace: '⊇' },
	{ pattern: /\\cup/g, replace: '∪' },
	{ pattern: /\\cap/g, replace: '∩' },
	{ pattern: /\\emptyset/g, replace: '∅' },
	{ pattern: /\\forall/g, replace: '∀' },
	{ pattern: /\\exists/g, replace: '∃' },
	{ pattern: /\\nexists/g, replace: '∄' },
	{ pattern: /\\neg/g, replace: '¬' },
	{ pattern: /\\land/g, replace: '∧' },
	{ pattern: /\\lor/g, replace: '∨' },
	{ pattern: /\\angle/g, replace: '∠' },
	{ pattern: /\\perp/g, replace: '⊥' },
	{ pattern: /\\parallel/g, replace: '∥' },
	{ pattern: /\\circ/g, replace: '∘' },
	{ pattern: /\\degree/g, replace: '°' },
	{ pattern: /\\div/g, replace: '÷' },
	{ pattern: /\\therefore/g, replace: '∴' },
	{ pattern: /\\because/g, replace: '∵' },
	{ pattern: /\\ldots/g, replace: '…' },
	{ pattern: /\\dots/g, replace: '…' },
	{ pattern: /\\cdots/g, replace: '⋯' }
];

const normalizeEquationText = (value: string): string => {
	let formatted = value;
	for (const replacement of latexReplacements) {
		formatted = formatted.replace(replacement.pattern, replacement.replace as never);
	}
	return formatted.replace(/\\([a-zA-Z]+)/g, '$1');
};

const latexCommandMap: Record<string, string> = {
	sin: 'sin',
	cos: 'cos',
	tan: 'tan',
	ln: 'ln',
	log: 'log',
	cdot: '⋅',
	times: '×',
	alpha: 'α',
	beta: 'β',
	gamma: 'γ',
	Gamma: 'Γ',
	delta: 'δ',
	Delta: 'Δ',
	epsilon: 'ε',
	varepsilon: 'ε',
	zeta: 'ζ',
	eta: 'η',
	theta: 'θ',
	Theta: 'Θ',
	vartheta: 'θ',
	iota: 'ι',
	kappa: 'κ',
	lambda: 'λ',
	Lambda: 'Λ',
	mu: 'μ',
	nu: 'ν',
	xi: 'ξ',
	Xi: 'Ξ',
	pi: 'π',
	Pi: 'Π',
	rho: 'ρ',
	sigma: 'σ',
	Sigma: 'Σ',
	tau: 'τ',
	upsilon: 'υ',
	Upsilon: 'Υ',
	phi: 'φ',
	Phi: 'Φ',
	varphi: 'φ',
	chi: 'χ',
	psi: 'ψ',
	Psi: 'Ψ',
	omega: 'ω',
	Omega: 'Ω',
	sum: '∑',
	prod: '∏',
	int: '∫',
	oint: '∮',
	partial: '∂',
	nabla: '∇',
	infty: '∞',
	pm: '±',
	mp: '∓',
	leq: '≤',
	geq: '≥',
	neq: '≠',
	approx: '≈',
	equiv: '≡',
	rightarrow: '→',
	Rightarrow: '⇒',
	leftarrow: '←',
	Leftarrow: '⇐',
	leftrightarrow: '↔',
	Leftrightarrow: '⇔',
	to: '→',
	in: '∈',
	notin: '∉',
	subset: '⊂',
	subseteq: '⊆',
	supset: '⊃',
	supseteq: '⊇',
	cup: '∪',
	cap: '∩',
	emptyset: '∅',
	forall: '∀',
	exists: '∃',
	nexists: '∄',
	neg: '¬',
	land: '∧',
	lor: '∨',
	angle: '∠',
	perp: '⊥',
	parallel: '∥',
	circ: '∘',
	degree: '°',
	div: '÷',
	therefore: '∴',
	because: '∵',
	ldots: '…',
	dots: '…',
	cdots: '⋯'
};

const operatorCommands = new Set(['cdot', 'times']);

const consumeWhitespace = (input: string, start: number): number => {
	let index = start;
	while (index < input.length && /\s/.test(input[index])) {
		index += 1;
	}
	return index;
};

const operatorChars = new Set(['+', '-', '=', '*', ',', ';', ':']);

const readCommand = (input: string, start: number): { command: string; nextIndex: number } => {
	let index = start;
	while (index < input.length && /[a-zA-Z]/.test(input[index])) {
		index += 1;
	}
	return { command: input.slice(start, index), nextIndex: index };
};

const extractTextCommand = (input: string, start: number): { content: string; nextIndex: number } | null => {
	// Check if this is a \text command
	if (!input.startsWith('\\text', start)) {
		return null;
	}
	
	let index = start + 5; // Skip '\text'
	index = consumeWhitespace(input, index);
	
	if (index >= input.length || input[index] !== '{') {
		return null;
	}
	
	// Extract the content inside braces
	let depth = 1;
	let cursor = index + 1;
	while (cursor < input.length && depth > 0) {
		const char = input[cursor];
		if (char === '{') {
			depth += 1;
		} else if (char === '}') {
			depth -= 1;
		}
		cursor += 1;
	}
	
	return { content: input.slice(index + 1, cursor - 1), nextIndex: cursor };
};

const extractGroupContent = (input: string, start: number): { content: string; nextIndex: number } => {
	let index = consumeWhitespace(input, start);
	if (index >= input.length) {
		return { content: '', nextIndex: index };
	}

	if (input[index] === '{') {
		let depth = 1;
		let cursor = index + 1;
		let content = '';
		
		while (cursor < input.length && depth > 0) {
			// Check for \text command inside braces
			if (input.startsWith('\\text{', cursor)) {
				const textMatch = extractTextCommand(input, cursor);
				if (textMatch) {
					content += textMatch.content;
					cursor = textMatch.nextIndex;
					// The textMatch already consumed the \text{...} including braces
					// Don't increment depth counters since they were handled
					continue;
				}
			}
			
			const char = input[cursor];
			
			if (char === '{') {
				depth += 1;
				content += char;
			} else if (char === '}') {
				depth -= 1;
				if (depth > 0) {
					content += char;
				}
			} else {
				content += char;
			}
			cursor += 1;
		}
		return { content, nextIndex: cursor };
	}

	if (input[index] === '\\') {
		const { command, nextIndex } = readCommand(input, index + 1);
		return { content: `\\${command}`, nextIndex };
	}

	let cursor = index;
	while (
		cursor < input.length &&
		!['^', '_', '/', '\\', '{', '}', ' '].includes(input[cursor]) &&
		!operatorChars.has(input[cursor])
	) {
		cursor += 1;
	}
	if (cursor === index) {
		return { content: input[index], nextIndex: index + 1 };
	}
	return { content: input.slice(index, cursor), nextIndex: cursor };
};

const applyScriptToSpecs = (
	specs: EquationRunSpec[],
	type: 'superScript' | 'subScript'
): EquationRunSpec[] =>
	specs.map((spec) => ({ ...spec, [type]: true }));

const parseEquationSpecs = (value: string): EquationRunSpec[] => {
	if (!value.trim()) {
		return [];
	}
	const specs: EquationRunSpec[] = [];
	let index = 0;
	let lastOperandStart = 0;

	const appendSpecs = (items: EquationRunSpec[], isOperand = false) => {
		if (!items.length) {
			return;
		}
		const start = specs.length;
		specs.push(...items);
		if (isOperand) {
			lastOperandStart = start;
		}
	};

	while (index < value.length) {
		index = consumeWhitespace(value, index);
		if (index >= value.length) {
			break;
		}

		if (value.startsWith('\\frac', index)) {
			index += 5;
			const numerator = extractGroupContent(value, index);
			index = numerator.nextIndex;
			const denominator = extractGroupContent(value, index);
			index = denominator.nextIndex;
			const numeratorSpecs = applyScriptToSpecs(parseEquationSpecs(numerator.content), 'superScript');
			const denominatorSpecs = applyScriptToSpecs(parseEquationSpecs(denominator.content), 'subScript');
			appendSpecs(numeratorSpecs, true);
			specs.push({ text: '/' });
			if (denominatorSpecs.length) {
				appendSpecs(denominatorSpecs, true);
			} else {
				lastOperandStart = specs.length;
			}
			continue;
		}

		const char = value[index];

		if (char === '/') {
			for (let i = lastOperandStart; i < specs.length; i += 1) {
				specs[i] = { ...specs[i], superScript: true };
			}
			index += 1;
			const denominator = extractGroupContent(value, index);
			index = denominator.nextIndex;
			specs.push({ text: '/' });
			const denominatorSpecs = applyScriptToSpecs(parseEquationSpecs(denominator.content), 'subScript');
			appendSpecs(denominatorSpecs, true);
			continue;
		}

		if (char === '^' || char === '_') {
			const isSuper = char === '^';
			index += 1;
			const scriptContent = extractGroupContent(value, index);
			index = scriptContent.nextIndex;
			
			// Process the content - it may already have \text{} resolved by extractGroupContent
			// Parse the content to create specs
			const scriptSpecs = parseEquationSpecs(scriptContent.content).map((spec) => ({
				...spec,
				superScript: isSuper ? true : spec.superScript,
				subScript: !isSuper ? true : spec.subScript
			}));
			appendSpecs(scriptSpecs, false);
			continue;
		}

		if (char === '{') {
			const group = extractGroupContent(value, index);
			index = group.nextIndex;
			appendSpecs(parseEquationSpecs(group.content), true);
			continue;
		}

		if (char === '\\') {
			// Check for \text command first
			const textCmd = extractTextCommand(value, index);
			if (textCmd) {
				index = textCmd.nextIndex;
				appendSpecs([{ text: textCmd.content }], true);
				continue;
			}
			
			const { command, nextIndex } = readCommand(value, index + 1);
			index = nextIndex;
			const mapped = latexCommandMap[command] ?? command;
			appendSpecs([{ text: mapped }], !operatorCommands.has(command));
			continue;
		}

		if (operatorChars.has(char)) {
			specs.push({ text: char });
			index += 1;
			continue;
		}

		let end = index;
		while (
			end < value.length &&
			!['^', '_', '/', '\\', '{', '}', ' '].includes(value[end]) &&
			!operatorChars.has(value[end])
		) {
			end += 1;
		}
		const chunk = value.slice(index, end);
		appendSpecs([{ text: chunk }], true);
		index = end;
	}

	return specs;
};

const buildEquationRuns = (
	value: string,
	fontFamily: string,
	size: number,
	style: InlineStyle
): TextRun[] => {
	const trimmed = value.trim();
	if (!trimmed) {
		return [];
	}

	const specs = parseEquationSpecs(trimmed);
	if (!specs.length) {
		return [];
	}

	return specs.map((spec) =>
		new TextRun({
			text: normalizeEquationText(spec.text),
			font: fontFamily,
			size,
			sizeComplexScript: size,
			bold: spec.bold ?? style.bold,
			italics: spec.italics ?? (style.italics ?? true),
			underline: spec.underline
				? { type: spec.underline }
				: style.underline
					? { type: style.underline }
					: undefined,
			superScript: spec.superScript,
			subScript: spec.subScript
		})
	);
};

const cloneStyle = (style: InlineStyle): InlineStyle => ({ ...style });

const mergeStyles = (base: InlineStyle, extra: InlineStyle): InlineStyle => ({
	bold: base.bold || extra.bold,
	italics: base.italics || extra.italics,
	underline: extra.underline ?? base.underline
});

const isSeparatorRow = (line: string): boolean => {
	const trimmed = line.trim();
	if (!trimmed.startsWith('|')) {
		return false;
	}
	const content = trimmed.replace(/^\||\|$/g, '');
	const cells = content.split('|').map((cell) => cell.trim());
	return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const splitWithBreaks = (value: string, style: InlineStyle): InlineSegment[] => {
	const parts = value.split(breakPattern);
	const segments: InlineSegment[] = [];
	parts.forEach((part, index) => {
		if (part) {
			segments.push({ text: part, style: cloneStyle(style) });
		}
		if (index < parts.length - 1) {
			segments.push({ style: cloneStyle(style), isBreak: true });
		}
	});
	return segments;
};

const findNextMarker = (text: string): { start: number; end: number; marker: string; style: InlineStyle } | null => {
	let earliest: { start: number; end: number; marker: string; style: InlineStyle } | null = null;

	for (const definition of markerDefinitions) {
		const { marker, style } = definition;
		const start = text.indexOf(marker);
		if (start === -1) {
			continue;
		}
		const end = text.indexOf(marker, start + marker.length);
		if (end === -1) {
			continue;
		}
		if (!earliest || start < earliest.start) {
			earliest = { start, end, marker, style };
		}
	}

	return earliest;
};

const findInlineEquation = (text: string): { start: number; end: number; delimiter: string } | null => {
	let pos = 0;
	
	// Find the earliest equation delimiter
	while (pos < text.length) {
		const dollarPos = text.indexOf('$', pos);
		if (dollarPos === -1) {
			return null;
		}
		
		// Check if it's a $$ delimiter
		if (text[dollarPos + 1] === '$') {
			// Find the matching closing $$
			const closingPos = text.indexOf('$$', dollarPos + 2);
			if (closingPos !== -1) {
				return { start: dollarPos, end: closingPos, delimiter: '$$' };
			}
			// If no closing $$, skip these two $ and continue
			pos = dollarPos + 2;
		} else {
			// Single $ delimiter
			const closingPos = text.indexOf('$', dollarPos + 1);
			if (closingPos !== -1) {
				// Make sure the closing $ is not part of $$
				if (text[closingPos - 1] !== '$' && text[closingPos + 1] !== '$') {
					return { start: dollarPos, end: closingPos, delimiter: '$' };
				}
			}
			// Skip this $ and continue
			pos = dollarPos + 1;
		}
	}
	
	return null;
};

const parseInlineSegments = (text: string, baseStyle: InlineStyle = {}): InlineSegment[] => {
	if (!text) {
		return [];
	}

	const equationMatch = findInlineEquation(text);
	const markerMatch = findNextMarker(text);

	if (equationMatch && (!markerMatch || equationMatch.start < markerMatch.start)) {
		const segments: InlineSegment[] = [];
		const { start, end, delimiter } = equationMatch;

		if (start > 0) {
			segments.push(...parseInlineSegments(text.slice(0, start), baseStyle));
		}

		const equationText = text.slice(start + delimiter.length, end).trim();
		if (equationText) {
			segments.push({
				text: equationText,
				style: mergeStyles(baseStyle, { italics: true }),
				isEquation: true
			});
		}

		const remaining = text.slice(end + delimiter.length);
		if (remaining) {
			segments.push(...parseInlineSegments(remaining, baseStyle));
		}

		return segments;
	}

	if (!markerMatch) {
		return splitWithBreaks(text, baseStyle);
	}

	const segments: InlineSegment[] = [];
	const { start, end, marker, style } = markerMatch;

	if (start > 0) {
		segments.push(...splitWithBreaks(text.slice(0, start), baseStyle));
	}

	const inner = text.slice(start + marker.length, end);
	segments.push(...parseInlineSegments(inner, mergeStyles(baseStyle, style)));

	const remaining = text.slice(end + marker.length);
	if (remaining) {
		segments.push(...parseInlineSegments(remaining, baseStyle));
	}

	return segments;
};

const segmentsToRuns = (segments: InlineSegment[], fontFamily: string, size: number): TextRun[] => {
	if (!segments.length) {
		return [
			new TextRun({ text: '', font: fontFamily, size, sizeComplexScript: size })
		];
	}

	return segments
		.map((segment) => {
		if (segment.isBreak) {
			return new TextRun({ text: '', break: 1, font: fontFamily, size, sizeComplexScript: size });
		}

		const { text = '', style } = segment;
		if (segment.isEquation) {
			const equationRuns = buildEquationRuns(text, fontFamily, size, style);
			if (equationRuns.length) {
				return equationRuns;
			}
		}

		return new TextRun({
			text,
			font: fontFamily,
			size,
			sizeComplexScript: size,
			bold: style.bold,
			italics: style.italics,
			underline: style.underline ? { type: style.underline } : undefined
		});
		})
		.reduce<TextRun[]>((acc, run) => (Array.isArray(run) ? acc.concat(run) : acc.concat([run])), []);
};

const createParagraph = (content: string, context: ParagraphContext): Paragraph =>
	new Paragraph({
		children: segmentsToRuns(parseInlineSegments(content), context.fontFamily, context.size),
		heading: context.headingLevel,
		spacing: { after: 200 },
		alignment: context.align
	});

const createTableCellParagraph = (content: string, fontFamily: string, size: number): Paragraph =>
	new Paragraph({
		children: segmentsToRuns(parseInlineSegments(content), fontFamily, size),
		spacing: { after: 120, line: 280 }
	});

const createTableCellParagraphs = (content: string, fontFamily: string, size: number): Paragraph[] => {
	// Split content by <br> or <br/> tags to create multiple paragraphs
	const lines = content.split(/<br\s*\/?>/i);
	
	return lines.map(line => 
		new Paragraph({
			children: segmentsToRuns(parseInlineSegments(line.trim()), fontFamily, size),
			spacing: { after: 120, line: 280 }
		})
	);
};

const createAlphaListParagraph = (
	line: string,
	fontFamily: string,
	size: number,
	isFirstBlock: boolean
): Paragraph => {
	const match = line.match(/^([a-z])\.\s*(.*)$/i);
	const marker = match?.[1] ? `${match[1].toLowerCase()}.` : '';
	const body = match?.[2] ?? '';

	const runs: TextRun[] = [];
	if (marker) {
		runs.push(
			new TextRun({
				text: `${marker} `,
				font: fontFamily,
				size,
				sizeComplexScript: size,
				bold: true
			})
		);
	}

	const bodySegments = segmentsToRuns(parseInlineSegments(body), fontFamily, size);
	runs.push(...bodySegments);

	return new Paragraph({
		children: runs,
		spacing: { after: 200 },
		indent: { left: 720, hanging: 360 },
		alignment: isFirstBlock ? AlignmentType.CENTER : undefined
	});
};

const splitTableCells = (line: string): string[] => {
	const cells: string[] = [];
	let currentCell = '';
	let inEquation = false;
	let equationDelimiter = '';

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		const nextChar = line[i + 1];

		// Check for equation delimiters
		if (char === '$') {
			if (nextChar === '$' && !inEquation) {
				// Starting $$
				inEquation = true;
				equationDelimiter = '$$';
				currentCell += '$$';
				i++; // Skip next $
				continue;
			} else if (inEquation && equationDelimiter === '$$' && nextChar === '$') {
				// Ending $$
				inEquation = false;
				equationDelimiter = '';
				currentCell += '$$';
				i++; // Skip next $
				continue;
			} else if (!inEquation) {
				// Starting single $
				inEquation = true;
				equationDelimiter = '$';
				currentCell += '$';
				continue;
			} else if (inEquation && equationDelimiter === '$') {
				// Ending single $
				inEquation = false;
				equationDelimiter = '';
				currentCell += '$';
				continue;
			}
		}

		// Only treat | as cell separator if not inside equation
		if (char === '|' && !inEquation) {
			cells.push(currentCell);
			currentCell = '';
		} else {
			currentCell += char;
		}
	}

	// Add the last cell
	if (currentCell) {
		cells.push(currentCell);
	}

	return cells.map(cell => cell.trim());
};

const createTable = (lines: string[], fontFamily: string, size: number): Table => {
	const rows = lines
		.filter((line) => !isSeparatorRow(line))
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			// Remove leading and trailing |
			const cleaned = line.replace(/^\||\|$/g, '');
			return splitTableCells(cleaned);
		});

	if (!rows.length) {
		return new Table({
			rows: [
				new TableRow({
					children: [
						new TableCell({
							children: [createTableCellParagraph('', fontFamily, size)],
							margins: {
								top: TABLE_CELL_MARGIN,
								bottom: TABLE_CELL_MARGIN,
								left: TABLE_CELL_MARGIN,
								right: TABLE_CELL_MARGIN
							}
						})
					]
				})
			]
		});
	}

	const columnCount = rows[0].length;

	const normalizedRows = rows.map((cells) => {
		if (cells.length === columnCount) {
			return cells;
		}
		return [...cells, ...Array.from({ length: columnCount - cells.length }, () => '')];
	});

	return new Table({
		width: { size: 100, type: WidthType.PERCENTAGE },
		rows: normalizedRows.map((cells, rowIndex) =>
			new TableRow({
				tableHeader: rowIndex === 0,
				children: cells.map((cell) =>
					new TableCell({
						children: createTableCellParagraphs(cell, fontFamily, size),
						margins: {
							top: TABLE_CELL_MARGIN,
							bottom: TABLE_CELL_MARGIN,
							left: TABLE_CELL_MARGIN,
							right: TABLE_CELL_MARGIN
						},
						shading: rowIndex === 0
							? {
								type: 'clear',
								fill: TABLE_HEADER_FILL,
								color: 'auto'
							}
							: undefined
					})
				)
			})
		)
	});
};

const createEquationParagraph = (equation: string, context: ParagraphContext): Paragraph =>
	new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: { before: 200, after: 200 },
		children: buildEquationRuns(equation, context.fontFamily, context.size, { italics: true })
	});

const collectParagraphLines = (lines: string[], startIndex: number): { text: string; nextIndex: number } => {
	const buffer: string[] = [];
	let index = startIndex;

	while (index < lines.length) {
		const current = lines[index];
		if (!current.trim()) {
			break;
		}
		if (current.trim().startsWith('|')) {
			break;
		}
		if (current.trim().startsWith('$$')) {
			break;
		}
		if (/^#{1,6}\s+/.test(current)) {
			break;
		}
		if (index > startIndex && alphaListPattern.test(current.trim())) {
			break;
		}
		buffer.push(current.trim());
		index += 1;
	}

	return { text: buffer.join(' '), nextIndex: index };
};

export const markdownToDocxBlob = async (
	markdown: string,
	options: MarkdownToDocxOptions = {}
): Promise<Blob> => {
	const fontFamily = options.fontFamily ?? options.font ?? DEFAULT_FONT_FAMILY;
	const normalSize = options.normalSize ?? DEFAULT_NORMAL_SIZE;
	const headingSizes = { ...DEFAULT_HEADING_SIZES, ...options.headingSizes } as Record<number, number>;
	
	console.log('[markdownToDocxBlob] Raw markdown first 200 chars:', markdown.substring(0, 200));
	console.log('[markdownToDocxBlob] Contains literal \\n:', markdown.includes('\\n'));
	console.log('[markdownToDocxBlob] Contains actual newline:', markdown.includes('\n'));
	
	// Fix corrupted LaTeX commands where backslashes were interpreted as escape sequences
	// This happens when markdown with LaTeX is stored/transmitted and escape sequences get processed
	let processedMarkdown = markdown
		// Fix escape sequences that became actual characters
		.replace(/\t(?=ext\{)/g, '\\t')           // Tab before ext{ → \text{
		.replace(/\f(?=rac\{)/g, '\\f')           // Form feed before rac{ → \frac{
		.replace(/\t(?=imes)/g, '\\t')            // Tab before imes → \times
		.replace(/\t(?=heta)/g, '\\t')            // Tab before heta → \theta
		// Now fix the partial commands to full LaTeX commands
		.replace(/\\text\{/g, '\\text{')
		.replace(/\\frac\{/g, '\\frac{')
		.replace(/\\times/g, '\\times')
		.replace(/\\theta/g, '\\theta')
		.replace(/\\sqrt\{/g, '\\sqrt{')
		.replace(/\\cdot/g, '\\cdot')
		.replace(/\\ldots/g, '\\ldots')
		.replace(/\\dots/g, '\\dots')
		.replace(/\\cdots/g, '\\cdots')
		.replace(/\\alpha/g, '\\alpha')
		.replace(/\\beta/g, '\\beta')
		.replace(/\\gamma/g, '\\gamma')
		.replace(/\\Delta/g, '\\Delta')
		.replace(/\\delta/g, '\\delta')
		.replace(/\\pi/g, '\\pi')
		.replace(/\\sum/g, '\\sum')
		.replace(/\\int/g, '\\int')
		.replace(/\\infty/g, '\\infty')
		.replace(/\\neq/g, '\\neq')
		.replace(/\\leq/g, '\\leq')
		.replace(/\\geq/g, '\\geq')
		.replace(/\\approx/g, '\\approx')
		.replace(/\\equiv/g, '\\equiv');
	
	console.log('[markdownToDocxBlob] After LaTeX fix, first 200 chars:', processedMarkdown.substring(0, 200));
	
	// Unescape literal \n and \r characters to actual newlines
	// This handles cases where the markdown has escaped newlines like "line1\\nline2"
	
	// Try to detect if we have literal backslash-n combinations
	if (processedMarkdown.includes('\\n') && !processedMarkdown.includes('\n')) {
		// Replace escaped newlines with actual newlines
		processedMarkdown = processedMarkdown
			.replace(/\\r\\n/g, '\n')
			.replace(/\\n/g, '\n')
			.replace(/\\r/g, '\r');
		console.log('[markdownToDocxBlob] Unescaped literal newlines');
	}
	
	const lines = processedMarkdown.split(/\r?\n/);
	const children: Array<Paragraph | Table> = [];
	let hasContent = false;

	console.log('[markdownToDocxBlob] Starting conversion');
	console.log('[markdownToDocxBlob] Total lines:', lines.length);
	console.log('[markdownToDocxBlob] First 5 lines:', lines.slice(0, 5));
	console.log('[markdownToDocxBlob] Last 5 lines:', lines.slice(-5));

	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			children.push(createParagraph('', { fontFamily, size: normalSize }));
			continue;
		}

		if (trimmed.startsWith('|')) {
			const tableLines: string[] = [];
			while (i < lines.length && lines[i].trim().startsWith('|')) {
				tableLines.push(lines[i]);
				i += 1;
			}
			children.push(createTable(tableLines, fontFamily, normalSize));
			hasContent = hasContent || tableLines.length > 0;
			i -= 1;
			continue;
		}

		if (trimmed.startsWith('$$')) {
			// Check if this line has multiple equation blocks (e.g., "$$eq1$$ or $$eq2$$")
			// Count the number of $$ pairs
			const dollarCount = (trimmed.match(/\$\$/g) || []).length;
			
			// If there are more than 2 $$, treat as inline equations (regular paragraph)
			if (dollarCount > 2) {
				// This is a paragraph with multiple inline equations
				children.push(
					createParagraph(trimmed, {
						fontFamily,
						size: normalSize,
						isFirstBlock: !hasContent
					})
				);
				hasContent = true;
				continue;
			}
			
			// Regular block equation handling
			let equationContent = '';
			if (trimmed === '$$') {
				while (i + 1 < lines.length) {
					i += 1;
					const candidate = lines[i];
					const candidateTrimmed = candidate.trim();
					if (candidateTrimmed === '$$') {
						break;
					}
					if (candidateTrimmed.endsWith('$$')) {
						const toAppend = candidateTrimmed.slice(0, -2).trim();
						equationContent = equationContent
							? equationContent + '\n' + toAppend
							: toAppend;
						break;
					}
					equationContent = equationContent
						? equationContent + '\n' + candidate
						: candidate;
				}
			} else if (trimmed.endsWith('$$')) {
				equationContent = trimmed.slice(2, -2).trim();
			} else {
				equationContent = trimmed.slice(2).trim();
				while (i + 1 < lines.length) {
					i += 1;
					const candidate = lines[i];
					const candidateTrimmed = candidate.trim();
					if (candidateTrimmed.endsWith('$$')) {
						const toAppend = candidateTrimmed.slice(0, -2).trim();
						equationContent = toAppend
							? equationContent + '\n' + toAppend
							: equationContent;
						break;
					}
					equationContent = equationContent + '\n' + candidate;
				}
			}

			children.push(createEquationParagraph(equationContent.trim(), { fontFamily, size: normalSize }));
			hasContent = hasContent || Boolean(equationContent.trim());
			continue;
		}

		const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
		if (headingMatch) {
			const level = headingMatch[1].length;
			const text = headingMatch[2]?.trim() ?? '';
			const headingLevel = headingLevelMap[level];
			const headingSize = headingSizes[level] ?? normalSize;
			children.push(
				createParagraph(text, {
					fontFamily,
					size: headingSize,
					headingLevel,
					isFirstBlock: !hasContent
				})
			);
			hasContent = hasContent || Boolean(text);
			continue;
		}

		if (alphaListPattern.test(trimmed)) {
			children.push(createAlphaListParagraph(trimmed, fontFamily, normalSize, !hasContent));
			hasContent = true;
			continue;
		}

		const paragraph = collectParagraphLines(lines, i);
		if (paragraph.text) {
			children.push(
				createParagraph(paragraph.text, {
					fontFamily,
					size: normalSize,
					isFirstBlock: !hasContent
				})
			);
			hasContent = true;
			i = paragraph.nextIndex - 1;
		} else {
			children.push(createParagraph('', { fontFamily, size: normalSize }));
		}
	}

	if (!children.length) {
		children.push(createParagraph('', { fontFamily, size: normalSize }));
	}

	console.log('[markdownToDocxBlob] Total children created:', children.length);
	console.log('[markdownToDocxBlob] Children types:', children.map(c => c.constructor.name));

	const document = new Document({
		styles: {
			default: {
				document: {
					run: {
						font: fontFamily,
						size: normalSize,
						sizeComplexScript: normalSize
					}
				}
			}
		},
		sections: [
			{
				properties: {},
				children
			}
		]
	});

	return Packer.toBlob(document);
};

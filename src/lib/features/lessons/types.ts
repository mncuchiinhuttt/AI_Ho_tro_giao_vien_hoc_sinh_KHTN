export type LessonVocabularyEntry = {
	word: string;
	ipa: string;
	english: string;
	vietnamese: string;
};

export type Lesson = {
	id: string;
	title: string;
	lessonContent: string;
	studyContent: string;
	vocabulary: LessonVocabularyEntry[];
	creatorId: string;
	createdAt: Date;
};

export type LessonSummary = {
	id: string;
	title: string;
	createdAt: Date;
};

export type GeneratedLessonData = {
	title: string;
	lesson_plan: string;
	study_content: string;
	vocabulary: LessonVocabularyEntry[];
};

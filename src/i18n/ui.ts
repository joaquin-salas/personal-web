import type { Locale } from "./locales";

// UI strings (labels, headings, buttons). Page content lives in src/data and src/content.
const en = {
	"site.description": "Joaquín Salas — Software engineer",
	"nav.label": "Main",
	"nav.home": "Home",
	"nav.about": "About",
	"nav.blog": "Blog",
	"languagePicker.label": "Language",
	"home.links": "Links",
	"home.about": "About",
	"home.experience": "Experience",
	"home.projects": "Projects",
	"home.education": "Education",
	"home.writing": "Latest writing",
	"home.allPosts": "All posts →",
	"home.contact": "Contact",
	"home.contactText":
		"I'm looking for my first full-time role as a software engineer. Feel free to reach out.",
	"project.code": "Code",
	"project.demo": "Live demo",
	"tags.label": "Technologies",
	"period.present": "Present",
	"blog.title": "Blog",
	"blog.description": "Articles and notes by Joaquín Salas",
	"blog.empty": "No posts yet.",
	"blog.draft": "(draft)",
	"blog.updated": "Updated",
	"blog.tags": "Tags",
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
	"site.description": "Joaquín Salas — Ingeniero de software",
	"nav.label": "Principal",
	"nav.home": "Inicio",
	"nav.about": "Sobre mí",
	"nav.blog": "Blog",
	"languagePicker.label": "Idioma",
	"home.links": "Enlaces",
	"home.about": "Sobre mí",
	"home.experience": "Experiencia",
	"home.projects": "Proyectos",
	"home.education": "Formación",
	"home.writing": "Últimos artículos",
	"home.allPosts": "Ver todos →",
	"home.contact": "Contacto",
	"home.contactText":
		"Estoy buscando mi primer empleo a tiempo completo como ingeniero de software. No dudes en escribirme.",
	"project.code": "Código",
	"project.demo": "Demo",
	"tags.label": "Tecnologías",
	"period.present": "Actualidad",
	"blog.title": "Blog",
	"blog.description": "Artículos y notas de Joaquín Salas",
	"blog.empty": "Todavía no hay artículos.",
	"blog.draft": "(borrador)",
	"blog.updated": "Actualizado",
	"blog.tags": "Etiquetas",
};

const ui: Record<Locale, Record<UIKey, string>> = { en, es };

export function useTranslations(locale: Locale) {
	return (key: UIKey): string => ui[locale][key];
}

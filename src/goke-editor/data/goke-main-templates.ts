/**
 * Gòke main templates — first-party multi-page packs.
 * Static files: public/goke-templates/{folder}/
 * Separate from CDN starter-templates (dawidolko).
 */

export type GokeMainTemplate = {
  id: string;
  folder: string;
  name: string;
  category: string;
  pages: string[];
  version: string;
  basePath: string;
  indexUrl: string;
};

export const GOKE_MAIN_TEMPLATES: GokeMainTemplate[] = [
  {
    id: "goke-app",
    folder: "goke-app",
    name: "G\u00f2ke SaaS & Tech Product",
    category: "saas",
    pages: ["index.html", "features.html", "pricing.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-app/",
    indexUrl: "/goke-templates/goke-app/index.html",
  },
  {
    id: "goke-auto",
    folder: "goke-auto",
    name: "G\u00f2ke Auto",
    category: "automobile",
    pages: ["index.html", "inventory.html", "vehicle.html", "services.html", "financing.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-auto/",
    indexUrl: "/goke-templates/goke-auto/index.html",
  },
  {
    id: "goke-blog",
    folder: "goke-blog",
    name: "G\u00f2ke Digital Editorial & Tech Blog",
    category: "blog",
    pages: ["index.html", "post.html", "categories.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-blog/",
    indexUrl: "/goke-templates/goke-blog/index.html",
  },
  {
    id: "goke-clinic",
    folder: "goke-clinic",
    name: "G\u00f2ke Clinic",
    category: "healthcare",
    pages: ["index.html", "about.html", "services.html", "doctors.html", "appointment.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-clinic/",
    indexUrl: "/goke-templates/goke-clinic/index.html",
  },
  {
    id: "goke-commerce",
    folder: "goke-commerce",
    name: "G\u00f2ke Commerce",
    category: "ecommerce",
    pages: ["index.html", "shop.html", "product.html", "cart.html", "checkout.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-commerce/",
    indexUrl: "/goke-templates/goke-commerce/index.html",
  },
  {
    id: "goke-commerce-2",
    folder: "goke-commerce-2",
    name: "G\u00f2ke Commerce",
    category: "ecommerce",
    pages: ["index.html", "shop.html", "product.html", "cart.html", "checkout.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-commerce-2/",
    indexUrl: "/goke-templates/goke-commerce-2/index.html",
  },
  {
    id: "goke-ecommerce",
    folder: "goke-ecommerce-3",
    name: "G\u00f2ke Boutique Store & Hardware Goods",
    category: "e-commerce",
    pages: ["index.html", "shop.html", "product.html", "cart.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-ecommerce-3/",
    indexUrl: "/goke-templates/goke-ecommerce-3/index.html",
  },
  {
    id: "goke-edu",
    folder: "goke-edu",
    name: "G\u00f2ke Academy",
    category: "education",
    pages: ["index.html", "courses.html", "course-detail.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-edu/",
    indexUrl: "/goke-templates/goke-edu/index.html",
  },
  {
    id: "goke-estate",
    folder: "goke-estate",
    name: "G\u00f2ke Estate",
    category: "real-estate",
    pages: ["index.html", "properties.html", "property-details.html", "agents.html", "agent-profile.html", "locations.html", "about.html", "services.html", "mortgage.html", "blog.html", "blog-single.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-estate/",
    indexUrl: "/goke-templates/goke-estate/index.html",
  },
  {
    id: "goke-luxe",
    folder: "goke-luxe",
    name: "G\u00f2ke Luxe",
    category: "fashion-luxury",
    pages: ["index.html", "shop.html", "collections.html", "product.html", "lookbook.html", "cart.html", "checkout.html", "wishlist.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-luxe/",
    indexUrl: "/goke-templates/goke-luxe/index.html",
  },
  {
    id: "goke-portfolio",
    folder: "goke-portfolio",
    name: "G\u00f2ke Creative & Engineering Portfolio",
    category: "portfolio",
    pages: ["index.html", "projects.html", "project-detail.html", "about.html", "contact.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-portfolio/",
    indexUrl: "/goke-templates/goke-portfolio/index.html",
  },
  {
    id: "goke-pro",
    folder: "goke-pro",
    name: "G\u00f2ke Pro",
    category: "professional-services",
    pages: ["index.html", "about.html", "services.html", "service-details.html", "team.html", "team-member.html", "case-studies.html", "case-study.html", "blog.html", "blog-single.html", "contact.html", "appointment.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-pro/",
    indexUrl: "/goke-templates/goke-pro/index.html",
  },
  {
    id: "goke-stay",
    folder: "goke-stay",
    name: "G\u00f2ke Stay",
    category: "hotel-booking",
    pages: ["index.html", "rooms.html", "room-details.html", "booking.html", "availability.html", "offers.html", "amenities.html", "gallery.html", "about.html", "restaurant.html", "contact.html", "faq.html"],
    version: "1.0.0",
    basePath: "/goke-templates/goke-stay/",
    indexUrl: "/goke-templates/goke-stay/index.html",
  },
];

export function gokeMainCategories(): string[] {
  return Array.from(new Set(GOKE_MAIN_TEMPLATES.map((t) => t.category))).sort();
}

export function gokeMainByCategory(category?: string): GokeMainTemplate[] {
  if (!category || category === "All") return GOKE_MAIN_TEMPLATES;
  return GOKE_MAIN_TEMPLATES.filter((t) => t.category === category);
}

export function findGokeMain(id: string): GokeMainTemplate | undefined {
  return GOKE_MAIN_TEMPLATES.find((t) => t.id === id || t.folder === id);
}

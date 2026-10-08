/**
 * Gòke Business Website Intelligence — 30 niche blueprints.
 * Business data → architecture → messaging → visual language → CTA.
 */

export type NicheId =
  | "restaurant_dining"
  | "fast_food_qsr"
  | "cafe_coffee"
  | "bakery_pastry"
  | "hotel_stay"
  | "event_centre"
  | "bar_lounge"
  | "fashion_boutique"
  | "african_wear"
  | "jewelry"
  | "hair_salon"
  | "barber_shop"
  | "spa_wellness"
  | "fitness_gym"
  | "healthcare_clinic"
  | "dental_clinic"
  | "pharmacy"
  | "real_estate"
  | "short_let"
  | "auto_dealership"
  | "auto_mechanic"
  | "logistics"
  | "law_firm"
  | "accounting"
  | "creative_agency"
  | "photography"
  | "school_education"
  | "church_faith"
  | "coach_consultant"
  | "tech_saas"
  | "general_business";

export interface NicheBlueprint {
  id: NicheId;
  label: string;
  group: string;
  keywords: string[];
  primaryGoal: string;
  secondaryGoal: string;
  primaryCTA: string;
  secondaryCTA: string;
  contactPriority: "whatsapp" | "phone" | "form" | "booking";
  requiredPages: { file: string; title: string }[];
  optionalPages?: { file: string; title: string }[];
  homepageSections: string[];
  heroConcept: string;
  heroHeadlineHints: string[];
  visualDirection: string;
  palette: string;
  typography: string;
  imagery: string;
  mood: string;
  lagosModules: string[];
  functionalModules: string[];
  trustSignals: string[];
  contentRules: string[];
  igMapping: string;
}

/** Full 30-niche catalogue (+ general) */
export const NICHE_BLUEPRINTS: NicheBlueprint[] = [
  {
    id: "restaurant_dining",
    label: "Restaurant / Dining",
    group: "Food & hospitality",
    keywords: ["restaurant", "dining", "chef", "menu", "fine dining", "bistro", "grill", "jollof", "kitchen"],
    primaryGoal: "reservation",
    secondaryGoal: "whatsapp_order",
    primaryCTA: "Reserve a Table",
    secondaryCTA: "View Menu",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "menu.html", title: "Menu" },
      { file: "about.html", title: "About" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    optionalPages: [{ file: "events.html", title: "Private Dining" }],
    homepageSections: [
      "announcement_bar",
      "hero_food_editorial",
      "trust_strip",
      "signature_dishes",
      "story",
      "atmosphere_gallery",
      "hours",
      "reviews",
      "location",
      "reservation_cta",
    ],
    heroConcept: "Appetite + atmosphere + confidence. Visitor understands food, vibe, location, hours, and can reserve in seconds.",
    heroHeadlineHints: ["Lagos dining, plated with intention.", "Contemporary food, warm hospitality."],
    visualDirection: "Editorial / warm",
    palette: "Warm neutrals, deep charcoal or wine accents, cream surfaces; appetizing contrast on CTAs",
    typography: "Refined serif headlines + clean sans body",
    imagery: "Plated dishes, dining room atmosphere, chef moments — never generic office stock",
    mood: "Warm, inviting, confident hospitality",
    lagosModules: ["WhatsAppCTA", "LagosLocation", "BusinessHours", "GoogleMap", "MenuGrid", "ReviewStrip"],
    functionalModules: ["menu_categories", "food_gallery", "reservation_form", "opening_hours", "instagram_gallery"],
    trustSignals: ["rating", "guests_served", "neighbourhood", "open_daily"],
    contentRules: ["No fake Michelin stars", "Use real captions for dish names when present", "CTA dominates: Reserve a Table"],
    igMapping: "Posts → signature dishes & gallery; bio → location & hours; highlights → menu categories",
  },
  {
    id: "fast_food_qsr",
    label: "Fast food / QSR / Cloud kitchen",
    group: "Food & hospitality",
    keywords: ["fast food", "qsr", "cloud kitchen", "delivery", "takeaway", "burger", "pizza", "shawarma", "order now"],
    primaryGoal: "order",
    secondaryGoal: "whatsapp_order",
    primaryCTA: "Order Now",
    secondaryCTA: "View Menu",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "menu.html", title: "Menu" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_speed", "popular_today", "product_cards", "categories", "how_it_works", "delivery_zones", "reviews", "whatsapp_cta"],
    heroConcept: "Speed + convenience + appetite. Homepage feels like a digital ordering counter.",
    heroHeadlineHints: ["Hot. Fast. Delivered.", "Order in minutes."],
    visualDirection: "Bold / energetic",
    palette: "High-energy brand colours, strong CTA contrast, clean white product cards",
    typography: "Bold sans throughout; large prices",
    imagery: "Product close-ups, packaging, delivery — appetizing and fast",
    mood: "Fast, clear, hungry",
    lagosModules: ["WhatsAppCTA", "DeliveryZone", "PriceCard", "MenuGrid", "BusinessHours"],
    functionalModules: ["product_grid", "prices_from_captions", "how_it_works", "delivery_areas"],
    trustSignals: ["delivery_time", "popular_items", "reviews"],
    contentRules: ["If captions have prices (₦), show them on cards", "Primary CTA Order Now / WhatsApp"],
    igMapping: "Product photos + prices → product cards; bio → delivery zones",
  },
  {
    id: "cafe_coffee",
    label: "Café / Coffee / Juice bar",
    group: "Food & hospitality",
    keywords: ["cafe", "café", "coffee", "latte", "espresso", "juice", "smoothie", "brunch"],
    primaryGoal: "visit",
    secondaryGoal: "whatsapp",
    primaryCTA: "Explore Menu",
    secondaryCTA: "Visit Us",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "menu.html", title: "Menu" },
      { file: "about.html", title: "About" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Visit Us" },
    ],
    homepageSections: ["hero_lifestyle", "featured_drinks", "bestsellers", "interior_gallery", "todays_ritual", "hours", "location"],
    heroConcept: "Lifestyle + ritual + atmosphere.",
    heroHeadlineHints: ["Your corner in the city.", "Coffee, conversations and good moments."],
    visualDirection: "Soft / lifestyle",
    palette: "Soft browns, cream, muted greens; gentle contrast",
    typography: "Friendly sans + light display headings",
    imagery: "Cups, interior seating, brunch plates, natural light",
    mood: "Relaxed, local, habitual",
    lagosModules: ["BusinessHours", "LagosLocation", "WhatsAppCTA", "MenuGrid", "InstagramProof"],
    functionalModules: ["todays_pick", "menu", "gallery", "map"],
    trustSignals: ["regulars", "neighbourhood", "hours"],
    contentRules: ["Optional featured drink of the day", "Visit Us is secondary CTA"],
    igMapping: "Drink/food posts → menu & featured; interior posts → gallery",
  },
  {
    id: "bakery_pastry",
    label: "Bakery / Pastry / Cake studio",
    group: "Food & hospitality",
    keywords: ["bakery", "pastry", "cake", "cakes", "confection", "cupcake", "bread", "custom cake"],
    primaryGoal: "custom_order",
    secondaryGoal: "whatsapp",
    primaryCTA: "Order a Cake",
    secondaryCTA: "View Gallery",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "cakes.html", title: "Cakes" },
      { file: "gallery.html", title: "Gallery" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_craft", "bestsellers", "categories", "custom_process", "gallery", "testimonials", "delivery_info", "cta"],
    heroConcept: "Craft + celebration + customization.",
    heroHeadlineHints: ["Made for the moments worth remembering."],
    visualDirection: "Warm / handcrafted",
    palette: "Cream, soft pink, cocoa browns, gold accents",
    typography: "Warm serif + soft sans",
    imagery: "Cakes, pastries, detail shots, celebrations",
    mood: "Celebratory, careful, delicious",
    lagosModules: ["WhatsAppCTA", "PriceCard", "DeliveryZone", "Gallery"],
    functionalModules: ["custom_order_steps", "category_grid", "gallery"],
    trustSignals: ["orders_fulfilled", "reviews", "delivery"],
    contentRules: ["Custom order flow: tell us → size/flavour → design → deliver"],
    igMapping: "Cake photos → gallery & bestsellers; captions → flavours",
  },
  {
    id: "hotel_stay",
    label: "Hotel / Lodge / Short-stay",
    group: "Travel & stay",
    keywords: ["hotel", "lodge", "suite", "resort", "stay", "accommodation", "rooms"],
    primaryGoal: "booking",
    secondaryGoal: "whatsapp",
    primaryCTA: "Check Availability",
    secondaryCTA: "Explore Rooms",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "rooms.html", title: "Rooms" },
      { file: "amenities.html", title: "Amenities" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_cinematic", "room_cards", "why_stay", "amenities", "reviews", "neighbourhood", "location", "booking_cta"],
    heroConcept: "Escape + comfort + location confidence.",
    heroHeadlineHints: ["Stay well in the heart of Lagos."],
    visualDirection: "Cinematic / premium",
    palette: "Deep neutrals, soft gold or teal accents, generous whitespace",
    typography: "Elegant serif + refined sans",
    imagery: "Property exteriors, rooms, amenities, neighbourhood — large cinematic shots",
    mood: "Premium, restful, assured",
    lagosModules: ["WhatsAppCTA", "GoogleMap", "BusinessHours", "ReviewStrip", "LagosLocation"],
    functionalModules: ["room_cards", "amenities_grid", "booking_cta", "map"],
    trustSignals: ["guest_reviews", "location", "amenities"],
    contentRules: ["Room cards: image, name, capacity, amenities, price if known, CTA"],
    igMapping: "Room/property posts → rooms & gallery; bio → location",
  },
  {
    id: "event_centre",
    label: "Event centre / Hall",
    group: "Travel & stay",
    keywords: ["event centre", "event center", "hall", "venue", "banquet", "wedding venue", "conference"],
    primaryGoal: "tour_enquiry",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book a Tour",
    secondaryCTA: "View Spaces",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "spaces.html", title: "Spaces" },
      { file: "packages.html", title: "Packages" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Enquire" },
    ],
    homepageSections: ["hero_grand", "spaces", "capacity", "packages", "past_events", "testimonials", "location", "enquiry"],
    heroConcept: "Scale + elegance + proof.",
    heroHeadlineHints: ["Where Lagos gathers."],
    visualDirection: "Grand / elegant",
    palette: "Deep jewel tones or classic black/gold; formal contrast",
    typography: "Strong display headings + formal body",
    imagery: "Hall interiors, staged events, seating scale",
    mood: "Grand, capable, professional",
    lagosModules: ["EnquiryForm", "WhatsAppCTA", "GoogleMap", "Gallery"],
    functionalModules: ["capacity_stats", "packages", "event_enquiry_form"],
    trustSignals: ["past_events", "capacity", "power_parking_security"],
    contentRules: ["Enquiry fields: event type, date, guests, budget, phone"],
    igMapping: "Event photos → gallery & proof; bio → capacity/location",
  },
  {
    id: "bar_lounge",
    label: "Bar / Lounge / Nightlife",
    group: "Food & hospitality",
    keywords: ["bar", "lounge", "nightlife", "club", "cocktails", "dj", "vip"],
    primaryGoal: "reservation",
    secondaryGoal: "events",
    primaryCTA: "Reserve a Table",
    secondaryCTA: "See Events",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "events.html", title: "Events" },
      { file: "menu.html", title: "Menu" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_night", "tonight", "events", "drinks", "experience", "gallery", "vip", "location"],
    heroConcept: "Mood + exclusivity + events.",
    heroHeadlineHints: ["Nights that hold the city."],
    visualDirection: "Dark / atmospheric",
    palette: "Near-black, neon or amber accents, high contrast CTAs",
    typography: "Bold modern sans; tight display lines",
    imagery: "Night interiors, cocktails, crowd energy, DJ — atmospheric",
    mood: "Dark, exclusive, electric",
    lagosModules: ["WhatsAppCTA", "BusinessHours", "Gallery", "LagosLocation"],
    functionalModules: ["events_list", "table_reservation", "menu"],
    trustSignals: ["events", "reviews"],
    contentRules: ["Age-appropriate tone; no illegal activity claims"],
    igMapping: "Event posts → events calendar; vibe posts → gallery",
  },
  {
    id: "fashion_boutique",
    label: "Fashion boutique / RTW",
    group: "Commerce & style",
    keywords: ["fashion", "boutique", "ready to wear", "rtw", "dress", "clothing", "apparel", "wear"],
    primaryGoal: "shop_whatsapp",
    secondaryGoal: "browse",
    primaryCTA: "Shop New Arrivals",
    secondaryCTA: "View Lookbook",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "shop.html", title: "Shop" },
      { file: "about.html", title: "About" },
      { file: "gallery.html", title: "Lookbook" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_editorial", "new_arrivals", "collections", "categories", "lookbook", "story", "instagram_proof", "cta"],
    heroConcept: "Editorial commerce — not a generic store template.",
    heroHeadlineHints: ["Designed for the woman who knows her style."],
    visualDirection: "Editorial / luxury",
    palette: "Monochrome or soft neutrals + one strong accent; fashion-forward",
    typography: "High-fashion display + minimal body",
    imagery: "Lookbook, product on model, fabric detail — editorial crops",
    mood: "Aspirational, sharp, current",
    lagosModules: ["WhatsAppCTA", "ProductGrid", "PriceCard", "InstagramProof"],
    functionalModules: ["product_from_captions", "lookbook", "category_shop"],
    trustSignals: ["instagram_following", "new_arrivals"],
    contentRules: ["Parse ₦ prices from captions into product cards when present"],
    igMapping: "Posts with products/prices → shop cards; styled shots → lookbook",
  },
  {
    id: "african_wear",
    label: "Ankara / African wear / Tailoring",
    group: "Commerce & style",
    keywords: ["ankara", "african wear", "agbada", "aso oke", "tailoring", "bespoke", "native", "owambe"],
    primaryGoal: "fitting",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book a Fitting",
    secondaryCTA: "View Collections",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "collections.html", title: "Collections" },
      { file: "bespoke.html", title: "Bespoke" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_culture", "latest", "rtw", "bespoke", "process", "gallery", "testimonials", "fitting_cta"],
    heroConcept: "Culture + craftsmanship + personal fit.",
    heroHeadlineHints: ["Cut for celebration."],
    visualDirection: "Cultural / vibrant",
    palette: "Rich cultural colours balanced with neutral grounds",
    typography: "Confident display + readable sans",
    imagery: "Fabric, full looks, celebrations, craft process",
    mood: "Proud, vibrant, skilled",
    lagosModules: ["WhatsAppCTA", "BookingWidget", "Gallery", "TeamGrid"],
    functionalModules: ["fitting_booking", "collections", "process_steps"],
    trustSignals: ["client_gallery", "process"],
    contentRules: ["CTA Book a Fitting dominates"],
    igMapping: "Finished garments → collections; process posts → bespoke story",
  },
  {
    id: "jewelry",
    label: "Jewelry / Beads / Accessories",
    group: "Commerce & style",
    keywords: ["jewelry", "jewellery", "beads", "accessories", "gold", "necklace", "earrings", "bridal"],
    primaryGoal: "shop_whatsapp",
    secondaryGoal: "bridal",
    primaryCTA: "Shop Collection",
    secondaryCTA: "Bridal Enquiries",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "shop.html", title: "Shop" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_detail", "new_arrivals", "bestsellers", "bridal", "materials", "reviews", "cta"],
    heroConcept: "Luxury through detail.",
    heroHeadlineHints: ["Details that finish the look."],
    visualDirection: "Minimal / premium",
    palette: "Soft black, ivory, metallic gold/silver accents",
    typography: "Minimal luxury sans or light serif",
    imagery: "Macro product detail, lifestyle on model, gift context",
    mood: "Quiet luxury, precise",
    lagosModules: ["WhatsAppCTA", "ProductGrid", "PriceCard"],
    functionalModules: ["product_grid", "bridal_cta"],
    trustSignals: ["materials", "reviews"],
    contentRules: ["Emphasize craft and finish; no false hallmark claims"],
    igMapping: "Product posts → shop; bridal sets → bridal section",
  },
  {
    id: "hair_salon",
    label: "Hair salon / Glam studio",
    group: "Beauty & wellness",
    keywords: ["salon", "hair", "glam", "braids", "wig", "makeup", "lash", "stylist"],
    primaryGoal: "booking",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book Appointment",
    secondaryCTA: "View Services",
    contactPriority: "booking",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "gallery.html", title: "Gallery" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Book" },
    ],
    homepageSections: ["hero_glam", "signature_services", "transformations", "team", "pricing", "reviews", "booking"],
    heroConcept: "Transformation + trust + booking.",
    heroHeadlineHints: ["Hair that holds the room."],
    visualDirection: "Glamorous",
    palette: "Soft black, blush, rose gold or purple accents",
    typography: "Glam display + clean sans",
    imagery: "Before/after, finished styles, salon interior, stylists",
    mood: "Glamorous, skilled, welcoming",
    lagosModules: ["BookingWidget", "WhatsAppCTA", "BeforeAfter", "TeamGrid", "PriceCard"],
    functionalModules: ["services_list", "booking_fields", "gallery"],
    trustSignals: ["transformations", "stylists", "reviews"],
    contentRules: ["Booking fields: service, stylist, date, time, phone"],
    igMapping: "Style posts → gallery & services; team posts → stylists",
  },
  {
    id: "barber_shop",
    label: "Barber shop",
    group: "Beauty & wellness",
    keywords: ["barber", "fade", "beard", "haircut", "barbershop", "waves", "lineup"],
    primaryGoal: "booking",
    secondaryGoal: "walk_in",
    primaryCTA: "Book a Chair",
    secondaryCTA: "See Cuts",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_sharp", "cut_menu", "barbers", "gallery", "hours", "book"],
    heroConcept: "Precision + identity + speed.",
    heroHeadlineHints: ["Fades. Lines. Fresh."],
    visualDirection: "Masculine / sharp",
    palette: "Black, charcoal, electric accent (blue/red/gold)",
    typography: "Bold condensed sans",
    imagery: "Fades, beard work, shop interior, barbers at work",
    mood: "Sharp, confident, quick",
    lagosModules: ["WhatsAppCTA", "BusinessHours", "BeforeAfter", "TeamGrid"],
    functionalModules: ["service_menu", "booking", "gallery"],
    trustSignals: ["barbers", "walk_in_hours"],
    contentRules: ["Keep copy short and punchy"],
    igMapping: "Cut photos → gallery; barber posts → team",
  },
  {
    id: "spa_wellness",
    label: "Spa / Wellness / Massage",
    group: "Beauty & wellness",
    keywords: ["spa", "massage", "wellness", "facial", "therapy", "sauna", "bodywork", "relax"],
    primaryGoal: "booking",
    secondaryGoal: "packages",
    primaryCTA: "Book a Session",
    secondaryCTA: "View Treatments",
    contactPriority: "booking",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Treatments" },
      { file: "about.html", title: "About" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Book" },
    ],
    homepageSections: ["hero_calm", "signature_treatments", "packages", "experience", "reviews", "gift", "booking"],
    heroConcept: "Calm + premium + trustworthy.",
    heroHeadlineHints: ["Reset in the middle of the city."],
    visualDirection: "Calm / minimalist",
    palette: "Sage, cream, soft stone, muted gold",
    typography: "Elegant serif + soft sans",
    imagery: "Treatment rooms, hands, towels, calm lighting",
    mood: "Serene, restorative, premium",
    lagosModules: ["BookingWidget", "WhatsAppCTA", "BusinessHours", "ReviewStrip"],
    functionalModules: ["treatment_list", "packages", "booking"],
    trustSignals: ["therapists", "reviews", "calm_space"],
    contentRules: ["No medical cure claims"],
    igMapping: "Treatment ambience → hero & gallery; services from captions",
  },
  {
    id: "fitness_gym",
    label: "Gym / Fitness / PT",
    group: "Beauty & wellness",
    keywords: ["gym", "fitness", "training", "coach", "workout", "crossfit", "pt", "personal trainer"],
    primaryGoal: "trial_session",
    secondaryGoal: "membership",
    primaryCTA: "Book a Free Session",
    secondaryCTA: "View Programs",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "programs.html", title: "Programs" },
      { file: "about.html", title: "Coaches" },
      { file: "gallery.html", title: "Results" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_energy", "programs", "coaches", "transformations", "membership", "facilities", "cta"],
    heroConcept: "Transformation + community + accountability.",
    heroHeadlineHints: ["Stronger starts here."],
    visualDirection: "Energetic",
    palette: "Dark base, high-energy accent (lime/orange/red), strong type",
    typography: "Heavy athletic sans",
    imagery: "Training, coaches, community, facilities",
    mood: "Motivating, strong, inclusive",
    lagosModules: ["WhatsAppCTA", "BeforeAfter", "TeamGrid", "PriceCard"],
    functionalModules: ["programs", "membership_plans", "goal_picker"],
    trustSignals: ["transformations", "coaches"],
    contentRules: ["No fake transformation stats"],
    igMapping: "Workout/result posts → social proof; coaches from posts",
  },
  {
    id: "healthcare_clinic",
    label: "Clinic / Healthcare",
    group: "Health & professional",
    keywords: ["clinic", "hospital", "doctor", "medical", "healthcare", "patient", "outpatient"],
    primaryGoal: "appointment",
    secondaryGoal: "info",
    primaryCTA: "Book an Appointment",
    secondaryCTA: "Our Services",
    contactPriority: "phone",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_trust", "services", "journey", "facilities", "hours", "faqs", "contact"],
    heroConcept: "Trust + accessibility + professionalism.",
    heroHeadlineHints: ["Care you can plan around."],
    visualDirection: "Clinical / reassuring",
    palette: "Clean white, soft blue/teal, high readability",
    typography: "Clear professional sans",
    imagery: "Facilities, caring staff (no graphic medical imagery)",
    mood: "Calm, competent, accessible",
    lagosModules: ["CallCTA", "WhatsAppCTA", "BusinessHours", "GoogleMap", "EnquiryForm"],
    functionalModules: ["services", "appointment_cta", "faqs"],
    trustSignals: ["hours", "location", "process"],
    contentRules: ["NEVER invent credentials, outcomes, or medical claims"],
    igMapping: "Facility/service posts → services; bio → contact",
  },
  {
    id: "dental_clinic",
    label: "Dental clinic",
    group: "Health & professional",
    keywords: ["dental", "dentist", "teeth", "orthodontic", "smile", "whitening"],
    primaryGoal: "consultation",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book a Dental Consultation",
    secondaryCTA: "Treatments",
    contactPriority: "booking",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Treatments" },
      { file: "gallery.html", title: "Smile Gallery" },
      { file: "contact.html", title: "Book" },
    ],
    homepageSections: ["hero_bright", "treatments", "smile_gallery", "team", "faqs", "booking"],
    heroConcept: "Comfort + confidence + clinical trust.",
    heroHeadlineHints: ["Confident smiles. Careful hands."],
    visualDirection: "Bright / clean",
    palette: "White, soft sky blue, fresh accents",
    typography: "Friendly professional sans",
    imagery: "Smile-focused, clean clinic, team",
    mood: "Bright, gentle, expert",
    lagosModules: ["BookingWidget", "WhatsAppCTA", "BeforeAfter", "TeamGrid"],
    functionalModules: ["treatments", "smile_gallery", "booking"],
    trustSignals: ["team", "gallery", "faqs"],
    contentRules: ["No invented clinical results"],
    igMapping: "Smile/clinic posts → gallery & trust",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    group: "Health & professional",
    keywords: ["pharmacy", "chemist", "drugstore", "prescription", "otc"],
    primaryGoal: "whatsapp_help",
    secondaryGoal: "visit",
    primaryCTA: "Chat on WhatsApp",
    secondaryCTA: "Our Services",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_access", "services", "delivery", "hours", "location", "whatsapp"],
    heroConcept: "Accessibility + trust + convenience.",
    heroHeadlineHints: ["Healthcare within reach."],
    visualDirection: "Accessible / trustworthy",
    palette: "Clean green/white or pharmacy blue; high clarity",
    typography: "Simple readable sans",
    imagery: "Storefront, shelves (tasteful), service — not controlled-substance imagery",
    mood: "Helpful, local, reliable",
    lagosModules: ["WhatsAppCTA", "BusinessHours", "GoogleMap", "CallCTA"],
    functionalModules: ["services", "hours", "whatsapp_desk"],
    trustSignals: ["hours", "location", "delivery"],
    contentRules: ["Never diagnose or prescribe via AI copy"],
    igMapping: "Service posts → services; bio → location/hours",
  },
  {
    id: "real_estate",
    label: "Real estate agency",
    group: "Property & auto",
    keywords: ["real estate", "property", "realtor", "apartment", "land", "for sale", "for rent", "lekki", "agent"],
    primaryGoal: "enquiry",
    secondaryGoal: "whatsapp",
    primaryCTA: "Talk to an Agent",
    secondaryCTA: "View Properties",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "properties.html", title: "Properties" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_space", "property_search_hint", "featured_properties", "areas", "agents", "cta"],
    heroConcept: "Inventory + location expertise + trust.",
    heroHeadlineHints: ["Find your place in Lagos."],
    visualDirection: "Premium / spacious",
    palette: "Navy or charcoal, gold/cream accents, airy layouts",
    typography: "Premium sans + strong numerals for prices",
    imagery: "Property exteriors/interiors, skyline, neighbourhood",
    mood: "Aspirational, clear, expert",
    lagosModules: ["WhatsAppCTA", "PropertyGrid", "LagosLocation", "EnquiryForm"],
    functionalModules: ["property_cards", "area_guides", "agent_cta"],
    trustSignals: ["areas_served", "listings"],
    contentRules: ["Property cards from IG when possible; no fake inventory counts"],
    igMapping: "Listing posts → property cards; areas in captions → area guides",
  },
  {
    id: "short_let",
    label: "Short-let / Airbnb host",
    group: "Property & auto",
    keywords: ["short let", "short-let", "airbnb", "apartment", "serviced apartment", "nightlife apartment"],
    primaryGoal: "booking",
    secondaryGoal: "whatsapp",
    primaryCTA: "Check Dates",
    secondaryCTA: "View Apartments",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "apartments.html", title: "Apartments" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_lifestyle", "featured", "amenities", "rules", "reviews", "location", "booking"],
    heroConcept: "Lifestyle + convenience + confidence.",
    heroHeadlineHints: ["Live Lagos. Sleep well."],
    visualDirection: "Lifestyle",
    palette: "Warm modern neutrals, soft accent",
    typography: "Friendly modern sans",
    imagery: "Apartment interiors, amenities, views",
    mood: "Comfortable, local, hosted",
    lagosModules: ["WhatsAppCTA", "GoogleMap", "ReviewStrip", "Gallery"],
    functionalModules: ["apartment_cards", "amenities", "booking_cta"],
    trustSignals: ["reviews", "amenities", "location"],
    contentRules: ["Clear house rules if mentioned in data"],
    igMapping: "Interior posts → apartments & gallery",
  },
  {
    id: "auto_dealership",
    label: "Car dealership",
    group: "Property & auto",
    keywords: ["cars", "dealership", "automobile", "toyota", "benz", "suv", "tokunbo", "foreign used"],
    primaryGoal: "inspection",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book Inspection",
    secondaryCTA: "View Inventory",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "inventory.html", title: "Inventory" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_auto", "featured_vehicles", "why_us", "process", "cta"],
    heroConcept: "Inventory + transparency + inspection.",
    heroHeadlineHints: ["Your next car, clearly presented."],
    visualDirection: "Automotive / technical",
    palette: "Dark metallic, red or electric accent, sharp cards",
    typography: "Technical sans; clear price hierarchy",
    imagery: "Vehicle exteriors/interiors, lot, detail shots",
    mood: "Transparent, sharp, commercial",
    lagosModules: ["WhatsAppCTA", "VehicleGrid", "PriceCard", "EnquiryForm"],
    functionalModules: ["vehicle_cards", "inspection_cta"],
    trustSignals: ["inspection", "condition_notes"],
    contentRules: ["No fake mileage or guarantee claims"],
    igMapping: "Car posts → inventory cards",
  },
  {
    id: "auto_mechanic",
    label: "Auto mechanic / Workshop",
    group: "Property & auto",
    keywords: ["mechanic", "workshop", "auto repair", "diagnostics", "servicing", "ac repair"],
    primaryGoal: "book_service",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book Service",
    secondaryCTA: "Our Services",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_trust", "services", "process", "brands", "reviews", "book"],
    heroConcept: "Trust + diagnosis + workmanship.",
    heroHeadlineHints: ["Fixed right. Explained clearly."],
    visualDirection: "Industrial / trustworthy",
    palette: "Industrial greys, safety orange or yellow accent",
    typography: "Sturdy sans",
    imagery: "Workshop, tools, careful repair (not dirty chaos)",
    mood: "Honest, skilled, clear",
    lagosModules: ["WhatsAppCTA", "BookingWidget", "BusinessHours", "ReviewStrip"],
    functionalModules: ["service_list", "process_steps", "booking"],
    trustSignals: ["process", "brands", "reviews"],
    contentRules: ["Process: Book → Diagnose → Explain → Repair → Return"],
    igMapping: "Job posts → proof; services from captions",
  },
  {
    id: "logistics",
    label: "Logistics / Courier / Dispatch",
    group: "Services & ops",
    keywords: ["logistics", "courier", "dispatch", "delivery", "shipping", "freight", "rider"],
    primaryGoal: "pickup",
    secondaryGoal: "whatsapp",
    primaryCTA: "Request Pickup",
    secondaryCTA: "Our Services",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_move", "services", "how_it_works", "coverage", "business", "cta"],
    heroConcept: "Movement + speed + reliability.",
    heroHeadlineHints: ["Lagos moves with us."],
    visualDirection: "Fast / operational",
    palette: "Bold primary (blue/orange), clean white sections",
    typography: "Operational sans; clear steps",
    imagery: "Riders, parcels, city movement — dynamic",
    mood: "Fast, dependable, operational",
    lagosModules: ["WhatsAppCTA", "ServiceArea", "DeliveryZone", "EnquiryForm"],
    functionalModules: ["services", "how_it_works", "coverage", "pickup_cta"],
    trustSignals: ["coverage", "speed_claims_only_if_in_data"],
    contentRules: ["No fake tracking product unless real"],
    igMapping: "Delivery posts → proof; areas in bio → coverage",
  },
  {
    id: "law_firm",
    label: "Law firm",
    group: "Health & professional",
    keywords: ["law", "lawyer", "legal", "attorney", "counsel", "chambers", "litigation"],
    primaryGoal: "consultation",
    secondaryGoal: "form",
    primaryCTA: "Request a Consultation",
    secondaryCTA: "Practice Areas",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Practice Areas" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_authority", "practice_areas", "firm", "approach", "contact_cta"],
    heroConcept: "Authority + discretion + expertise.",
    heroHeadlineHints: ["Counsel for complex matters."],
    visualDirection: "Restrained / authoritative",
    palette: "Deep navy/black, ivory, minimal gold; large whitespace",
    typography: "Classical serif headings + precise sans body",
    imagery: "Minimal; architecture or abstract — avoid cheesy gavel stock",
    mood: "Authoritative, discreet, precise",
    lagosModules: ["EnquiryForm", "CallCTA", "TeamGrid"],
    functionalModules: ["practice_areas", "consultation_cta"],
    trustSignals: ["practice_areas", "professional_tone"],
    contentRules: ["Never invent case results, credentials, or rankings"],
    igMapping: "Thought leadership captions → insights tone; bio → practice focus",
  },
  {
    id: "accounting",
    label: "Accounting / Tax / Audit",
    group: "Health & professional",
    keywords: ["accounting", "accountant", "tax", "audit", "bookkeeping", "payroll", "finance advisory"],
    primaryGoal: "consultation",
    secondaryGoal: "whatsapp",
    primaryCTA: "Book an Introductory Consultation",
    secondaryCTA: "Our Services",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_clarity", "services", "who_we_help", "approach", "cta"],
    heroConcept: "Clarity + compliance + business intelligence.",
    heroHeadlineHints: ["Numbers in order. Businesses clearer."],
    visualDirection: "Corporate / precise",
    palette: "Corporate blue/grey, crisp white",
    typography: "Precise professional sans",
    imagery: "Clean workspace, charts abstract, team professional",
    mood: "Clear, orderly, advisory",
    lagosModules: ["EnquiryForm", "WhatsAppCTA", "TeamGrid"],
    functionalModules: ["services", "industries", "consultation"],
    trustSignals: ["services_breadth", "sme_focus"],
    contentRules: ["No fake certifications"],
    igMapping: "Service posts → services list",
  },
  {
    id: "creative_agency",
    label: "Marketing / Creative agency",
    group: "Creative & brand",
    keywords: ["agency", "marketing", "branding", "creative", "advertising", "social media agency"],
    primaryGoal: "start_project",
    secondaryGoal: "whatsapp",
    primaryCTA: "Start a Project",
    secondaryCTA: "See Our Work",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "work.html", title: "Work" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_bold", "featured_work", "services", "process", "clients", "cta"],
    heroConcept: "Proof before promises.",
    heroHeadlineHints: ["We build brands people remember."],
    visualDirection: "Experimental / creative",
    palette: "Bold brand-led; high contrast; expressive",
    typography: "Expressive display + modern body",
    imagery: "Portfolio work, campaigns, team creative energy",
    mood: "Bold, inventive, proven",
    lagosModules: ["EnquiryForm", "WhatsAppCTA", "Gallery", "InstagramProof"],
    functionalModules: ["case_studies", "services", "process"],
    trustSignals: ["work_samples", "clients"],
    contentRules: ["Feature real IG work as portfolio; no fake metrics"],
    igMapping: "Best posts → featured work",
  },
  {
    id: "photography",
    label: "Photography / Videography",
    group: "Creative & brand",
    keywords: ["photography", "photographer", "videography", "wedding photographer", "portrait"],
    primaryGoal: "booking",
    secondaryGoal: "whatsapp",
    primaryCTA: "Check Availability",
    secondaryCTA: "View Portfolio",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "gallery.html", title: "Portfolio" },
      { file: "services.html", title: "Services" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Book" },
    ],
    homepageSections: ["hero_immersive", "categories", "selected_work", "services", "testimonials", "cta"],
    heroConcept: "Portfolio first.",
    heroHeadlineHints: ["Frames that keep the moment."],
    visualDirection: "Visual / immersive",
    palette: "Dark UI for photos to pop, or minimal white gallery",
    typography: "Minimal; let images lead",
    imagery: "Full-bleed portfolio — the product is the image",
    mood: "Immersive, artistic, professional",
    lagosModules: ["WhatsAppCTA", "Gallery", "BookingWidget", "ReviewStrip"],
    functionalModules: ["portfolio_grid", "packages", "booking"],
    trustSignals: ["portfolio", "testimonials"],
    contentRules: ["IG posts ARE the portfolio — prioritise large imagery"],
    igMapping: "All strong images → portfolio categories",
  },
  {
    id: "school_education",
    label: "School / Lesson centre",
    group: "Community & learning",
    keywords: ["school", "academy", "lessons", "tuition", "education", "nursery", "secondary"],
    primaryGoal: "tour",
    secondaryGoal: "enquire",
    primaryCTA: "Book a School Tour",
    secondaryCTA: "Our Programs",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "programs.html", title: "Programs" },
      { file: "about.html", title: "About" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Admissions" },
    ],
    homepageSections: ["hero_warm", "programs", "why_us", "facilities", "testimonials", "admissions", "cta"],
    heroConcept: "Trust + learning + future.",
    heroHeadlineHints: ["Learning that prepares them for more."],
    visualDirection: "Warm / institutional",
    palette: "Warm institutional blues/greens, approachable",
    typography: "Friendly authoritative sans",
    imagery: "Learners, facilities, activities (respect privacy)",
    mood: "Warm, structured, hopeful",
    lagosModules: ["EnquiryForm", "WhatsAppCTA", "Gallery", "BusinessHours"],
    functionalModules: ["programs", "admissions_steps", "tour_cta"],
    trustSignals: ["programs", "parent_voice", "facilities"],
    contentRules: ["No fabricated exam rankings"],
    igMapping: "Activity posts → gallery; programs from captions",
  },
  {
    id: "church_faith",
    label: "Church / Ministry",
    group: "Community & learning",
    keywords: ["church", "ministry", "parish", "fellowship", "sermon", "worship", "pastor"],
    primaryGoal: "plan_visit",
    secondaryGoal: "community",
    primaryCTA: "Plan Your Visit",
    secondaryCTA: "Service Times",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "about.html", title: "About" },
      { file: "events.html", title: "Events" },
      { file: "contact.html", title: "Visit" },
    ],
    homepageSections: ["hero_welcome", "service_times", "events", "ministries", "community", "location", "visit_cta"],
    heroConcept: "Welcome + community + participation.",
    heroHeadlineHints: ["A place to belong. A community to grow with."],
    visualDirection: "Welcoming / community",
    palette: "Warm light, soft gold or blue accents",
    typography: "Warm readable serif/sans pair",
    imagery: "Community, worship atmosphere, leadership (respectful)",
    mood: "Welcoming, hopeful, communal",
    lagosModules: ["WhatsAppCTA", "GoogleMap", "BusinessHours", "EnquiryForm"],
    functionalModules: ["service_times", "events", "plan_visit"],
    trustSignals: ["service_times", "location", "community"],
    contentRules: ["No political campaigning; inclusive welcome tone"],
    igMapping: "Service/event posts → events; bio → service times",
  },
  {
    id: "coach_consultant",
    label: "Coach / Consultant / Personal brand",
    group: "Creative & brand",
    keywords: ["coach", "coaching", "consultant", "speaker", "mentor", "personal brand"],
    primaryGoal: "consultation",
    secondaryGoal: "programs",
    primaryCTA: "Book a Consultation",
    secondaryCTA: "View Programs",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "about.html", title: "About" },
      { file: "services.html", title: "Services" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_person", "authority", "story", "services", "framework", "testimonials", "booking"],
    heroConcept: "Person → authority → transformation → offer.",
    heroHeadlineHints: ["Clarity for ambitious professionals."],
    visualDirection: "Personal / authoritative",
    palette: "Personal brand colours; clean contrast",
    typography: "Confident human sans or modern serif",
    imagery: "Professional portrait, speaking, workspace",
    mood: "Clear, human, expert",
    lagosModules: ["WhatsAppCTA", "BookingWidget", "ReviewStrip"],
    functionalModules: ["services", "programs", "booking"],
    trustSignals: ["method", "testimonials_if_real"],
    contentRules: ["NEVER invent achievements, client results, or credentials"],
    igMapping: "Portrait + captions → authority story; offers → services",
  },
  {
    id: "tech_saas",
    label: "Tech / Software / Digital product",
    group: "Services & ops",
    keywords: ["saas", "software", "app", "platform", "startup", "tech", "digital product"],
    primaryGoal: "demo",
    secondaryGoal: "learn",
    primaryCTA: "Book a Demo",
    secondaryCTA: "Explore the Product",
    contactPriority: "form",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "product.html", title: "Product" },
      { file: "about.html", title: "About" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero_product", "problem", "solution", "features", "use_cases", "proof", "cta"],
    heroConcept: "Problem → product → proof → demonstration.",
    heroHeadlineHints: ["Software that fits how teams actually work."],
    visualDirection: "Product-led / modern",
    palette: "Modern product UI colours; gradients sparingly",
    typography: "Modern product sans (Inter/Geist-like)",
    imagery: "UI mockups, product screens, abstract tech",
    mood: "Modern, clear, capable",
    lagosModules: ["EnquiryForm", "WhatsAppCTA"],
    functionalModules: ["features", "demo_cta", "faq"],
    trustSignals: ["use_cases", "clarity"],
    contentRules: ["No fake user counts or uptime SLAs"],
    igMapping: "Product screenshots → features; launch posts → story",
  },
  {
    id: "general_business",
    label: "Other business",
    group: "General",
    keywords: [],
    primaryGoal: "contact",
    secondaryGoal: "whatsapp",
    primaryCTA: "Get in Touch",
    secondaryCTA: "Learn More",
    contactPriority: "whatsapp",
    requiredPages: [
      { file: "index.html", title: "Home" },
      { file: "about.html", title: "About" },
      { file: "services.html", title: "Services" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    homepageSections: ["hero", "about", "services", "gallery", "testimonials", "contact"],
    heroConcept: "Clear offer + proof + conversion.",
    heroHeadlineHints: ["Built for how you work."],
    visualDirection: "Clean / professional",
    palette: "Neutral professional with one brand accent",
    typography: "Clean sans pair",
    imagery: "Brand-relevant from Instagram; avoid random stock",
    mood: "Professional, clear, approachable",
    lagosModules: ["WhatsAppCTA", "EnquiryForm", "BusinessHours", "GoogleMap"],
    functionalModules: ["services", "gallery", "contact"],
    trustSignals: ["clarity", "contact"],
    contentRules: ["Ground all copy in provided business data"],
    igMapping: "Bio → positioning; posts → services/gallery",
  },
];

export function getBlueprint(id: string): NicheBlueprint {
  return (
    NICHE_BLUEPRINTS.find((b) => b.id === id) ||
    NICHE_BLUEPRINTS.find((b) => b.id === "general_business")!
  );
}

/** Score Instagram text against blueprints */
export function detectBlueprint(profile: {
  name?: string;
  username?: string;
  bio?: string;
  posts?: { caption?: string }[];
  nicheHint?: string;
}): NicheBlueprint {
  if (profile.nicheHint) {
    const direct = NICHE_BLUEPRINTS.find((b) => b.id === profile.nicheHint);
    if (direct && direct.id !== "general_business") return direct;
  }
  const text = [
    profile.name || "",
    profile.username || "",
    profile.bio || "",
    ...(profile.posts || []).map((p) => p.caption || ""),
    profile.nicheHint || "",
  ]
    .join(" ")
    .toLowerCase();

  let best = getBlueprint("general_business");
  let bestScore = 0;
  for (const b of NICHE_BLUEPRINTS) {
    if (b.id === "general_business") continue;
    let score = 0;
    for (const kw of b.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.includes(" ") ? 4 : Math.min(kw.length, 10) / 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = b;
    }
  }
  return bestScore < 2 ? getBlueprint("general_business") : best;
}

/** Prompt block injected into Groq generation */
export function formatBlueprintForPrompt(bp: NicheBlueprint): string {
  const pages = bp.requiredPages
    .map((p) => `${p.file} (${p.title})`)
    .join(", ");
  const optional = (bp.optionalPages || [])
    .map((p) => `${p.file} (${p.title})`)
    .join(", ");

  return `
=== GÒKE BUSINESS INTELLIGENCE BLUEPRINT ===
Niche: ${bp.id} — ${bp.label}
Core concept: ${bp.heroConcept}
Visual direction: ${bp.visualDirection}
Mood: ${bp.mood}
Palette: ${bp.palette}
Typography: ${bp.typography}
Imagery: ${bp.imagery}

Primary conversion goal: ${bp.primaryGoal}
Primary CTA label (use exactly or very close): "${bp.primaryCTA}"
Secondary CTA: "${bp.secondaryCTA}"
Contact priority: ${bp.contactPriority}

REQUIRED multi-page set (emit ===PAGE:filename=== for each):
${pages}
${optional ? `Optional if data supports: ${optional}` : ""}

Homepage section order (implement these, skip only if data truly missing):
${bp.homepageSections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Lagos / local modules to include when relevant:
${bp.lagosModules.join(", ")}

Functional modules: ${bp.functionalModules.join(", ")}
Trust signals: ${bp.trustSignals.join(", ")}

Instagram → site mapping:
${bp.igMapping}

Content rules:
${bp.contentRules.map((r) => `- ${r}`).join("\n")}

Hero headline inspiration (adapt to brand voice, do not copy blindly):
${bp.heroHeadlineHints.map((h) => `- "${h}"`).join("\n")}

Architecture rule: pages, sections, and CTAs MUST follow this blueprint — do not output a generic Home/About/Contact clone when this niche specifies richer structure.
`.trim();
}

/** Options for HeroUpload / generate-handle */
export const NICHE_SELECT_OPTIONS: { id: NicheId; label: string; group: string }[] =
  NICHE_BLUEPRINTS.map((b) => ({ id: b.id, label: b.label, group: b.group }));

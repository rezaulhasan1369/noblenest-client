import { eventImageManifest, type EventImageAsset } from "./event-image-manifest";

export type CommunityEventConcept = {
  slug: string; image: EventImageAsset; proposedLocation: string;
  description: string; anticipatedImpact: string;
};

// Concepts only: no database IDs, schedules, registrations or confirmed venues.
const conceptContent = [
  [
    "Cox's Bazar",
    "A proposed beach cleanup would bring neighbours together to collect and sort shoreline litter.",
    "Encourage careful waste disposal and help protect shared coastal spaces."
  ],
  [
    "Patenga",
    "A proposed coastal cleanup would focus on litter along public walkways and the nearby shore.",
    "Make coastal spaces more welcoming while encouraging responsible visits."
  ],
  [
    "Hatirjheel",
    "A proposed lakeside cleanup would invite residents to care for paths and collect discarded packaging.",
    "Support cleaner shared walking spaces and everyday stewardship of the lake surroundings."
  ],
  [
    "Chattogram",
    "A proposed tree planting activity would pair sapling planting with a plan for watering and continued care.",
    "Encourage long-term care for local greenery rather than a single planting day."
  ],
  [
    "Dhaka",
    "A proposed urban greening activity would identify suitable planting spaces and invite neighbours to care for young trees.",
    "Build shared responsibility for greenery in busy urban neighbourhoods."
  ],
  [
    "Sylhet",
    "A proposed community planting day would help families learn how to plant and maintain suitable young trees.",
    "Connect generations through practical care for their local environment."
  ],
  [
    "Mirpur",
    "A proposed food support initiative would collect suitable supplies and distribute them respectfully according to locally identified needs.",
    "Help neighbours support food access while protecting the dignity of recipients."
  ],
  [
    "Chattogram",
    "A proposed shared-meal initiative would coordinate safe food preparation and respectful distribution.",
    "Create an opportunity for neighbours to support one another through nutritious meals."
  ],
  [
    "Rajshahi",
    "A proposed food distribution activity would organise practical food supplies for households that request support.",
    "Encourage reliable, considerate community support without making assumptions about individual needs."
  ],
  [
    "Rangpur",
    "A proposed winter warmth drive would gather clean blankets and arrange respectful distribution before colder weather.",
    "Help neighbours prepare for cold conditions through useful, appropriate donations."
  ],
  [
    "Mohammadpur",
    "A proposed blanket drive would match clean, usable blankets with needs identified through community consultation.",
    "Make practical winter support easier to offer and receive with dignity."
  ],
  [
    "Dinajpur",
    "A proposed clothing drive would collect clean warm garments, sort them by size and offer families suitable choices.",
    "Support comfort in colder weather while encouraging thoughtful reuse."
  ],
  [
    "Dhaka",
    "A proposed learning circle would offer guided writing practice and supportive study activities for children.",
    "Encourage confidence and curiosity through patient, age-appropriate learning support."
  ],
  [
    "Khulna",
    "A proposed digital skills workshop would offer guided practice with basic computer tasks and safer online habits.",
    "Help young learners build confidence using everyday digital tools."
  ],
  [
    "Cumilla",
    "A proposed reading club would bring children together for shared stories and conversations about books.",
    "Nurture curiosity, listening and enjoyment of reading in a welcoming setting."
  ],
  [
    "Gazipur",
    "A proposed awareness day would offer accessible health information and signposting to qualified local services.",
    "Encourage informed conversations about wellbeing; clinical services would require qualified professionals."
  ],
  [
    "Dhaka",
    "A proposed dengue awareness activity would discuss standing-water prevention and share guidance from qualified public-health sources.",
    "Encourage practical prevention habits and timely consultation with qualified health services."
  ],
  [
    "Barishal",
    "A proposed outreach session would combine health information with signposting to professional care; any screening would require qualified staff and consent.",
    "Help neighbours find reliable information and appropriate care without promising medical outcomes."
  ]
] as const;

export const communityEventConcepts: readonly CommunityEventConcept[] = eventImageManifest.map((image, index) => ({
  // Approved asset names provide stable, URL-safe identifiers independent of titles.
  slug: image.src.split("/").at(-1)!.replace(/^\d+-/, "").replace(/\.webp$/, ""),
  image,
  proposedLocation: conceptContent[index][0],
  description: conceptContent[index][1],
  anticipatedImpact: conceptContent[index][2],
}));

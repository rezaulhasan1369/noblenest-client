import type { UpcomingEvent } from "@/lib/upcoming-events";
import type { EventImageAsset } from "@/lib/event-image-manifest";

// Development presentation data only. Never seed or return this as a live feed.
const locations = ["Cox's Bazar", "Patenga, Chattogram", "Hatirjheel, Dhaka", "Chattogram", "Dhaka", "Sylhet", "Mirpur, Dhaka", "Chattogram", "Rajshahi", "Rangpur", "Mohammadpur, Dhaka", "Dinajpur", "Dhaka", "Khulna", "Cumilla", "Gazipur", "Dhaka", "Barishal"];
const descriptions: Record<string, string> = {
  "Environmental Cleanup": "A demonstration of neighbours caring for shared spaces through a community cleanup.",
  "Tree Plantation": "A demonstration of planting young trees and caring for greener community spaces.",
  "Food Distribution": "A demonstration of sharing food and essential supplies with the community.",
  "Winter Donation": "A demonstration of sharing warm clothing and blankets for colder days.",
  "Education & Mentorship": "A demonstration of supporting learning through shared knowledge and mentorship.",
  "Community Health & Awareness": "A demonstration of sharing accessible health information with the community.",
};

export function createDemoEvent(image: EventImageAsset): UpcomingEvent {
  const index = Number(image.id) - 1;
  return {
    id: `demo-${image.id}`, title: image.title, eventType: image.category,
    location: locations[index], eventDate: new Date(Date.UTC(2099, 0, index + 1, 3 + index % 4)).toISOString(),
    thumbnailUrl: image.src, thumbnailAlt: image.alt, description: descriptions[image.category],
  };
}

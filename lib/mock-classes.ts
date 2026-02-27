import type { ClassWithMeta } from "./class-queries";

export type ClassWithPrice = ClassWithMeta & {
  price?: string;
};

function mockClass(
  overrides: Partial<ClassWithPrice> & {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    meeting_days: string;
    schedule_summary: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    location_tag: string;
    location_details: string;
    total_spots: number;
    registrationCount: number;
    price?: string;
    image_url?: string;
    description?: string;
    requirements?: string;
    host_blurb?: string;
  }
): ClassWithPrice {
  return {
    host_id: null,
    image_url: null,
    weeks: 4,
    description: null,
    requirements: null,
    host_blurb: null,
    created_at: "2026-01-01T00:00:00Z",
    class_registrations: [],
    isRegistered: false,
    spotsLeft: overrides.total_spots - overrides.registrationCount,
    ...overrides,
  };
}

export const MOCK_CLASSES: ClassWithPrice[] = [
  mockClass({
    id: "mock-candlemaking-001",
    title: "Introduction to Candlemaking",
    image_url: "https://picsum.photos/seed/candle2026/800/500",
    level: "Beginner",
    weeks: 4,
    total_spots: 14,
    registrationCount: 7,
    start_date: "2026-03-10",
    end_date: "2026-03-31",
    start_time: "18:00",
    end_time: "20:00",
    meeting_days: "Tuesdays",
    schedule_summary: "4 Tuesdays",
    location_tag: "DTLA",
    location_details: "Two Cents Studio — 820 S Flower St, Los Angeles, CA 90017",
    price: "$45 / session",
    description:
      "Discover the craft of candlemaking from the ground up. Over four hands-on Tuesdays, you'll learn to work with different wax types, fragrance blending, and wick selection to pour your own signature candles. No experience needed — all materials included.\n\nBy the end of the series you'll leave with four unique candles you made yourself and the skills to keep creating at home.",
    requirements:
      "No experience necessary. All materials, tools, and workspace are provided. Wear clothes you don't mind getting a little waxy!",
    host_blurb:
      "Maya Chen is a Los Angeles-based artisan candlemaker with over eight years of experience crafting small-batch candles. She started Two Wicks Studio in Silver Lake in 2018 and has since taught hundreds of students the meditative art of candle craft. Her work has been featured in Kinfolk, Domino, and the Los Angeles Times.",
  }),

  mockClass({
    id: "mock-flowers-002",
    title: "Flower Arranging Workshop",
    image_url: "https://picsum.photos/seed/flowers2026/800/500",
    level: "Beginner",
    weeks: 6,
    total_spots: 12,
    registrationCount: 3,
    start_date: "2026-03-08",
    end_date: "2026-04-12",
    start_time: "10:00",
    end_time: "12:00",
    meeting_days: "Sundays",
    schedule_summary: "6 Sundays",
    location_tag: "DTLA",
    location_details: "Two Cents Studio — 820 S Flower St, Los Angeles, CA 90017",
    price: "$55 / session",
    description:
      "Learn the art of seasonal flower arranging in this relaxed, joyful workshop series. Each Sunday we'll explore a different style — from ikebana-inspired minimalism to lush English garden arrangements — using fresh blooms sourced from the LA Flower Market.\n\nYou'll develop an eye for color, texture, and proportion, and you'll take home your arrangement each week. A perfect ritual for your Sunday mornings.",
    requirements:
      "No experience needed. Fresh flowers, vases, and all tools are provided. You'll take your arrangement home each week!",
    host_blurb:
      "Sofia Rodriguez trained as a floral designer in Barcelona before moving to Los Angeles, where she runs Pétalo, a boutique floral studio in Arts District. She specializes in organic, garden-style arrangements and teaches with warmth and a deep love for seasonal blooms. Her arrangements have graced events at the Hammer Museum and the Ace Hotel.",
  }),

  mockClass({
    id: "mock-writing-003",
    title: "Fiction Writing Circle",
    image_url: "https://picsum.photos/seed/writing2026/800/500",
    level: "Beginner",
    weeks: 4,
    total_spots: 16,
    registrationCount: 9,
    start_date: "2026-03-04",
    end_date: "2026-03-25",
    start_time: "19:00",
    end_time: "21:00",
    meeting_days: "Wednesdays",
    schedule_summary: "4 Wednesdays",
    location_tag: "Online",
    location_details: "Zoom — link shared after registration",
    price: "$30 / session",
    description:
      "Whether you have a half-finished story in a drawer or you've never put words to the page before, this circle is for you. Each week we'll write together using prompts, share short pieces, and give warm, generative feedback in a supportive setting.\n\nThe focus is on getting words out, finding your voice, and having fun with language — not on perfection. Think of it as a regular practice and a small community of fellow curious writers.",
    requirements:
      "Just bring yourself and a notebook or laptop. No prior writing experience needed. This is a judgment-free zone — courage is the only requirement.",
    host_blurb:
      "James Park is a fiction writer and writing teacher based in Los Angeles. His debut short story collection was published in 2023 and his work has appeared in The Paris Review, Ploughshares, and McSweeney's. He's taught writing at UCLA Extension for six years and believes everyone has a story worth telling.",
  }),

  mockClass({
    id: "mock-photography-004",
    title: "Film Photography 101",
    image_url: "https://picsum.photos/seed/filmphoto2026/800/500",
    level: "Beginner",
    weeks: 4,
    total_spots: 10,
    registrationCount: 6,
    start_date: "2026-03-05",
    end_date: "2026-03-26",
    start_time: "18:00",
    end_time: "20:30",
    meeting_days: "Thursdays",
    schedule_summary: "4 Thursdays",
    location_tag: "DTLA",
    location_details: "Two Cents Studio — 820 S Flower St, Los Angeles, CA 90017",
    price: "$75 / session",
    description:
      "Put down the phone and pick up a film camera. This four-week course covers everything you need to start shooting on 35mm: understanding exposure, reading light, composing intentionally, and getting your film developed.\n\nWe'll shoot on location around DTLA and Chinatown, develop your first rolls together in our darkroom, and look at the work of photographers who shaped the medium. Film cameras are provided — all you need is curiosity and patience.",
    requirements:
      "No camera or experience needed. 35mm film cameras, two rolls of 35mm film, and darkroom time are included. Just wear comfortable shoes — we'll be walking!",
    host_blurb:
      "Alex Kim is a Los Angeles-based photographer whose work spans editorial, documentary, and fine art. He has shot for The New Yorker, TIME, and Vogue, and has shown work at the Getty and the Annenberg Space for Photography. Alex started shooting on film at age 14 and has never stopped — he believes the constraints of film make you a better photographer and a more present person.",
  }),

  mockClass({
    id: "mock-bread-005",
    title: "Sourdough Bread Baking",
    image_url: "https://picsum.photos/seed/bread2026/800/500",
    level: "Beginner",
    weeks: 2,
    total_spots: 8,
    registrationCount: 3,
    start_date: "2026-03-07",
    end_date: "2026-03-14",
    start_time: "09:00",
    end_time: "12:00",
    meeting_days: "Saturdays",
    schedule_summary: "2 Saturdays",
    location_tag: "DTLA",
    location_details: "Two Cents Studio — 820 S Flower St, Los Angeles, CA 90017",
    price: "$65 / session",
    description:
      "Baking sourdough is part science, part patience, and entirely satisfying. In this two-week series, you'll learn to maintain a sourdough starter, mix and shape dough by hand, and bake a proper country loaf with a crackly crust.\n\nWeek one covers the starter and bulk fermentation. Week two is all about shaping and baking. You'll take home your loaf, the recipe, and the confidence to do it at home. Aprons and all ingredients included.",
    requirements:
      "No baking experience needed. Ingredients, tools, and aprons are provided. You'll take home your baked loaves each week!",
    host_blurb:
      "Elena Vasquez grew up in her grandmother's kitchen in Oaxaca and has been baking bread professionally for twelve years. She trained at the San Francisco Baking Institute before opening her own sourdough pop-up, Pan Vivo, at the DTLA Farmers Market. Elena's bread has a cult following in Los Angeles and she loves nothing more than teaching people to make it themselves.",
  }),

  mockClass({
    id: "mock-watercolor-006",
    title: "Watercolor Painting for Beginners",
    image_url: "https://picsum.photos/seed/watercolor2026/800/500",
    level: "Beginner",
    weeks: 4,
    total_spots: 15,
    registrationCount: 12,
    start_date: "2026-03-06",
    end_date: "2026-03-27",
    start_time: "16:00",
    end_time: "18:00",
    meeting_days: "Fridays",
    schedule_summary: "4 Fridays",
    location_tag: "DTLA",
    location_details: "Two Cents Studio — 820 S Flower St, Los Angeles, CA 90017",
    price: "$50 / session",
    description:
      "Watercolor is one of the most expressive and forgiving mediums — the paint moves, blends, and surprises you. This beginner series is a gentle introduction to color mixing, wet-on-wet and wet-on-dry techniques, and painting simple subjects like botanicals, landscapes, and everyday objects.\n\nEach class ends with a finished piece you can take home. No artistic background needed — just bring an open mind and we'll take care of the rest.",
    requirements:
      "No art experience needed. All materials — professional watercolor paints, brushes, watercolor paper, and water containers — are provided. Wear clothes you don't mind getting colorful!",
    host_blurb:
      "Priya Sharma is a Mumbai-born, Los Angeles-based artist and illustrator. Her intricate botanical watercolors have been licensed by Anthropologie, Chronicle Books, and Paper Source, and her online tutorials have been watched by over two million people. Priya teaches with the belief that making art is a form of self-care, and that anyone — truly anyone — can learn to paint.",
  }),
];

export function getMockClassById(id: string): ClassWithPrice | undefined {
  return MOCK_CLASSES.find((c) => c.id === id);
}

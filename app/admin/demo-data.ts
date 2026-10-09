export type ContentItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  status: "Published" | "Draft";
  date: string;
  description: string;
};

export const initialProjects: ContentItem[] = [
  { id: 1, title: "Classic Concrete Planters", category: "Branding · Photography", image: "image-205", status: "Published", date: "Oct 08, 2026", description: "A fresh perspective on the everyday. A visual exploration of organic growth, texture, and the beauty of simple objects." },
  { id: 2, title: "The Shape of an Idea", category: "Art direction · Branding", image: "image-206", status: "Published", date: "Oct 06, 2026", description: "An explosion of color and imagination. Art direction that transforms a familiar object into an unforgettable brand experience." },
  { id: 3, title: "A Moment in Time", category: "Digital · Photography", image: "image-208", status: "Published", date: "Oct 04, 2026", description: "A cinematic study of time and transformation. Bold digital imagery brings a new dimension to an editorial story." },
  { id: 4, title: "Beyond the Ordinary", category: "Campaign · Branding", image: "image-207", status: "Draft", date: "Oct 02, 2026", description: "Past and future meet in a surreal visual world. An expressive campaign built around craft, curiosity, and unexpected ideas." },
];

export const initialArticles: ContentItem[] = [
  { id: 11, title: "Looking for Professional Digital Solutions Today?", category: "Digital strategy", image: "rectangle-21014", status: "Published", date: "Jul 16, 2026", description: "A good digital experience starts with a clear idea. We bring strategy, design, and development together to create websites that feel effortless to use and unmistakably yours." },
  { id: 12, title: "Need Professional Digital Solutions For Growth?", category: "Business & growth", image: "rectangle-21013", status: "Published", date: "Apr 22, 2026", description: "Digital growth is built on understanding your customers. Thoughtful design connects a business with its audience." },
  { id: 13, title: "Building a Brand That Lasts", category: "Branding", image: "rectangle-21016", status: "Draft", date: "Feb 22, 2026", description: "The strongest brands make complex things feel simple. Consistency builds trust across every touchpoint." },
];

export const initialTeam = [
  { id: 21, title: "Alex Morgan", category: "CEO", image: "ellipse-331", status: "Published" as const, date: "Oct 01, 2026", description: "Leading the studio with a focus on creative strategy and thoughtful digital experiences." },
  { id: 22, title: "Maya Johnson", category: "General Manager", image: "ellipse-6", status: "Published" as const, date: "Oct 01, 2026", description: "Bringing people, projects, and ideas together." },
  { id: 23, title: "Daniel Lewis", category: "Vice President", image: "ellipse-332", status: "Published" as const, date: "Oct 01, 2026", description: "Building lasting client relationships and helping the studio grow." },
  { id: 24, title: "Ethan Parker", category: "Design Director", image: "ellipse-333", status: "Published" as const, date: "Oct 01, 2026", description: "Turning ambitious ideas into distinctive visual experiences." },
];

export const initialInquiries = [
  { id: 31, name: "Sophie Chen", initials: "SC", company: "Forma Studio", subject: "A fresh identity for our studio", service: "Brand identity", date: "Today, 10:24 AM", read: false, message: "Hello Aviva! We are looking for a creative partner to refresh our studio's brand identity and website. We love the work in your portfolio and would like to discuss a potential collaboration. Our timeline is around 6–8 weeks. Looking forward to hearing from you!", email: "sophie@example.com" },
  { id: 32, name: "James Wilson", initials: "JW", company: "North & Co.", subject: "Let's talk about a new website", service: "Web design", date: "Yesterday, 3:45 PM", read: false, message: "We are planning a new website for North & Co. and would love to learn more about your design process. Could you share some information about your approach and typical timelines?", email: "james@example.com" },
  { id: 33, name: "Aarav Sharma", initials: "AS", company: "Local Collective", subject: "Campaign collaboration", service: "Marketing", date: "Oct 07, 2026", read: true, message: "Our collective is putting together a new campaign and we're interested in collaborating on art direction and creative production. We'd love to explore what we could make together.", email: "aarav@example.com" },
];

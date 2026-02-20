/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export interface Testimonial {
  id: string;
  nameKey: string;
  locationKey: string;
  reviewKey: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    nameKey: "testimonials.customer1.name",
    locationKey: "testimonials.customer1.location",
    reviewKey: "testimonials.customer1.review",
    rating: 5,
    avatar: "/images/avatars/placeholder.jpg",
  },
  {
    id: "2",
    nameKey: "testimonials.customer2.name",
    locationKey: "testimonials.customer2.location",
    reviewKey: "testimonials.customer2.review",
    rating: 5,
    avatar: "/images/avatars/placeholder.jpg",
  },
  {
    id: "3",
    nameKey: "testimonials.customer3.name",
    locationKey: "testimonials.customer3.location",
    reviewKey: "testimonials.customer3.review",
    rating: 4,
    avatar: "/images/avatars/placeholder.jpg",
  },
];

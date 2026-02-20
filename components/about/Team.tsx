/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
"use client";

import { useTranslations } from "next-intl";
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons-react";

const teamMembers = [
  {
    id: "founder",
    image: "/images/team/placeholder.jpg",
  },
  {
    id: "cto",
    image: "/images/team/placeholder.jpg",
  },
  {
    id: "operations",
    image: "/images/team/placeholder.jpg",
  },
  {
    id: "marketing",
    image: "/images/team/placeholder.jpg",
  },
];

export default function Team() {
  const t = useTranslations();

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
            {t("about.team.title")}
          </h2>
          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-neutral-600">
            {t("about.team.subtitle")}
          </p>
        </div>

        {/* Team grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="animate-fade-in-up group text-center"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-3xl">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                  <span className="text-sm text-neutral-400">[Photo]</span>
                </div>

                {/* Social overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-primary/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <a
                    href="#"
                    className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white hover:text-primary"
                  >
                    <IconBrandLinkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white hover:text-primary"
                  >
                    <IconBrandTwitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white hover:text-primary"
                  >
                    <IconMail size={20} />
                  </a>
                </div>
              </div>

              {/* Info */}
              <h3 className="mb-1 text-lg font-semibold text-neutral-900">
                {t(`about.team.members.${member.id}.name`)}
              </h3>
              <p className="text-primary">
                {t(`about.team.members.${member.id}.role`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

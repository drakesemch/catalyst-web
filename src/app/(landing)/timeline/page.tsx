import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Hourglass } from "lucide-react";

export default function TimelinePage() {
  const events = [
    {
      date: new Date(2024, 1, 27),
      title: "Development Started",
      description:
        "When we began developing Catalyst, our initial ideas quickly evolved as we recognized the potential to create something truly exceptional. We aimed for perfection in every aspect, from user interface design to feature integration, ensuring a seamless and engaging experience for all users. This commitment to excellence drove us to refine and enhance Catalyst continually, resulting in a powerful and intuitive platform that transforms the Canvas LMS experience.",
    },
    {
      date: new Date(2024, 9, 1),
      title: "Limited Beta Release",
      description:
        "During this phase, a select group of users will have exclusive access to the application, allowing us to gather valuable feedback and make final adjustments. This beta period is crucial for ensuring Catalyst meets the highest standards of quality and functionality. By participating, you'll help shape the future of Catalyst and experience its innovative features before anyone else.",
    },
    {
      date: new Date(2025, 0, 1),
      title: "Public Release",
      description:
        "After months of development and thorough testing, Catalyst is will be available to all users. This release marks a significant milestone, bringing our vision of a more intuitive, feature-rich, and engaging learning platform to life. We are confident that Catalyst will transform your Canvas LMS experience, offering unparalleled functionality and seamless integration. Join us as we embark on this exciting journey and elevate your learning experience with Catalyst.",
    },
    {
      date: new Date(2025, 2, 1),
      title: "Future Updates",
      description:
        "Our commitment to innovation and excellence extends beyond the initial release of Catalyst. We will continue to enhance and expand the platform, introducing new features, improvements, and integrations to further elevate your learning experience. By staying up-to-date with the latest updates, you can take full advantage of Catalyst's capabilities and enjoy a seamless and engaging learning experience like never before.",
    },
  ];
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-16">
        <div className="flex w-[min(80ch,100%)] flex-col gap-6">
          <h1 className="h1">Timeline</h1>
          <div className="relative isolate flex flex-col gap-8">
            <div className="absolute left-0.5 top-0 -z-10 h-full w-1 rounded-full bg-secondary" />
            {events.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="h-16 w-2 flex-shrink-0 rounded-full bg-secondary" />
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      {event.date.toDateString()}
                    </span>
                    {Date.now() <= Number(event.date) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="destructive"
                            className="flex cursor-pointer gap-1 text-xs"
                          >
                            <Hourglass />
                            Planned
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[40ch]">
                          <p className="text-md font-bold">Planned Event</p>
                          <p className="mt-2 text-sm">
                            This event is planned for the future and is subject
                            to change. Please check back for updates.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                  <p className="text-xl font-bold">{event.title}</p>
                  <p className="text-md mt-2 text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
            <div />
          </div>
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

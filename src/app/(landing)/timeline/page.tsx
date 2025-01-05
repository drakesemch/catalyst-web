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
      date: new Date(2024, 4, 1),
      title: "Re-design Started",
      description:
        "As we progressed with the development of Catalyst, we realized the importance of user feedback and engagement. We decided to re-design the platform to enhance its usability and functionality, making it more intuitive and user-friendly. This re-design phase allowed us to incorporate valuable insights from our users, ensuring that Catalyst meets their needs and expectations. By focusing on user experience and feedback, we were able to create a more engaging and feature-rich learning platform.",
    },
    {
      date: new Date(2025, 0, 1),
      title: "Limited Beta Release",
      description:
        "As we approached the beta release of Catalyst, we were excited to share our progress with a select group of users. This limited beta period allowed us to gather valuable feedback and insights, helping us identify areas for improvement and refine the platform further. The feedback we received was invaluable, guiding us in our mission to create a more intuitive, feature-rich, and engaging learning platform. During this phase, not all features were fully implemented, but we are committed to delivering a complete and polished experience in the final release.",
    },
    {
      date: new Date(2025, 2, 1),
      title: "Full Beta Release",
      description:
        "Following the success of the limited beta release, we are excited to announce the full beta release of Catalyst. This release marks a significant milestone in our journey, bringing us one step closer to our vision of transforming the Canvas LMS experience. With a focus on user feedback and continuous improvement, we have refined and enhanced Catalyst to deliver a more intuitive, feature-rich, and engaging learning platform. We are confident that Catalyst will revolutionize the way you interact with your educational platform, offering unparalleled functionality and a seamless user experience.",
    },
    {
      date: new Date(2025, 5, 1),
      title: "Public Release",
      description:
        "After months of development and thorough testing, Catalyst is will be available to all users. This release marks a significant milestone, bringing our vision of a more intuitive, feature-rich, and engaging learning platform to life. We are confident that Catalyst will transform your Canvas LMS experience, offering unparalleled functionality and seamless integration. Join us as we embark on this exciting journey and elevate your learning experience with Catalyst.",
    },
    {
      date: new Date(2025, 5, 1),
      title: "Future Updates",
      description:
        "Our commitment to innovation and excellence extends beyond the initial release of Catalyst. We will continue to enhance and expand the platform, introducing new features, improvements, and integrations to further elevate your learning experience. By staying up-to-date with the latest updates, you can take full advantage of Catalyst's capabilities and enjoy a seamless and engaging learning experience like never before.",
    },
  ];
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
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

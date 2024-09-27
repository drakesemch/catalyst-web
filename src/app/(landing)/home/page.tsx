import { Integrations } from "@/components/catalyst/landing/integrations";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import Marquee from "@/components/magicui/marquee";
import TextReveal from "@/components/magicui/text-reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowRight, Info, Star } from "lucide-react";

import { ProductImageCarousel } from "@/components/catalyst/landing/product-images";
import { MobilePreview } from "@/components/catalyst/landing/app-preview";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { LandingFooter } from "@/components/catalyst/landing/navs";
import { OpenApp } from "@/components/catalyst/landing/open-app";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  return (
    <>
      <main className="flex min-h-[calc(100vh-4.5rem-1px)] flex-col items-center [&>*]:w-[min(120ch,100%)]">
        <Header />
        <IntegrationSection />
        <Notifications />
        <AndMore />
        <Reveal />
        <Reviews />
        <ProductImage />
        <GetStarted />
      </main>
      <LandingFooter />
    </>
  );
}

async function Header() {
  return (
    <header className="flex min-h-[calc((100vh-4.5rem-1px)+16rem-4rem)] w-full flex-col items-start justify-center gap-2 px-8 md:min-h-[calc((100vh-4.5rem-1px)-4rem)]">
      <h1 className="h1 flex flex-wrap gap-3">
        <span className="animate-fade-in opacity-0 animate-delay-200">
          Welcome
        </span>
        <span className="animate-fade-in opacity-0 animate-delay-700">to</span>
        <span className="animate-fade-in opacity-0 animate-delay-1000">
          Catalyst
        </span>
      </h1>
      <p className="text-md animate-fade-in text-muted-foreground opacity-0 animate-delay-2000">
        Expedite your learning experience!
      </p>
      <div />
      <Button
        variant="outline"
        size="sm"
        className="animate-fade-in opacity-0 animate-delay-2200"
        href="/timeline"
      >
        <AnimatedShinyText className="inline-flex items-center justify-center !text-muted-foreground/70 transition ease-out hover:!text-foreground/70">
          <div className="inline-flex gap-2">
            <span>🪲</span>
            <span>Timeline: Limited Beta Release</span>
          </div>
          <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </Button>
      <div />
      <Separator className="w-40 animate-fade-in opacity-0 animate-delay-2400" />
      <div />
      <div className="flex flex-wrap gap-2">
        <div className="animate-fade-in opacity-0 animate-delay-2600">
          <Suspense fallback={<Skeleton className="h-10 w-[10ch]" />}>
            <OpenApp />
          </Suspense>
        </div>
        <Button
          variant="outline"
          className="animate-fade-in opacity-0 animate-delay-2800"
          href="#integrations"
        >
          <Info />
          Learn More
        </Button>
      </div>
      <div className="[&_*]:delay-3200 relative top-[10rem] h-96 w-[min(120ch,100%)] animate-fade-in opacity-0 animate-delay-3200 md:top-[calc(50vh-10rem)] md:h-0 [&_*]:animate-delay-3200">
        <MobilePreview />
      </div>
    </header>
  );
}

function IntegrationSection() {
  return (
    <>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
        className="rotate-180"
      />
      <section
        className="-my-3 flex min-h-[40rem] !w-full flex-col items-center justify-center bg-muted/30 p-8"
        id="integrations"
      >
        <div className="flex max-w-[100ch] flex-col items-center justify-center gap-8 md:flex-row">
          <Integrations />
          <Separator orientation="vertical" className="hidden h-36 md:block" />
          <div className="flex flex-col gap-2">
            <h2 className="h2">Our Integrations</h2>
            <p className="max-w-[80ch] text-muted-foreground">
              Catalyst integrates with your favorite tools to help you stay
              organized and on track with your studies. With Catalyst, you can
              access your study materials, connect with classmates, and track
              your progress all in one place.
            </p>
          </div>
        </div>
      </section>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
      />
    </>
  );
}

function Notifications() {
  const notifications = [
    {
      name: "Assignment Due",
      description: "Math Homework Due Tomorrow",
      time: "1 hour ago",
    },
    {
      name: "Exam Reminder",
      description: "Math Exam Next Week",
      time: "2 hours ago",
    },
    {
      name: "Zach",
      description: "Hey there! How are you doing?",
      time: "4 hours ago",
    },
    {
      name: "Overview is Ready",
      description: "Click here to view your overview",
      time: "34 minutes ago",
    },
    {
      name: "Assignment Due",
      description: "Math Homework Due Tomorrow",
      time: "1 hour ago",
    },
    {
      name: "Quinn",
      description: "What did you get for question 3?",
      time: "3 hours ago",
    },
  ];
  return (
    <>
      <section className="-my-3 flex min-h-[40rem] !w-full flex-col items-center justify-center p-8">
        <div className="flex max-w-[100ch] flex-col-reverse items-center justify-center gap-8 md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="h2">Our Notifications</h2>
            <p className="max-w-[80ch] text-muted-foreground">
              Catalyst sends you notifications to help you stay on track with
              your studies. With Catalyst, you can receive notifications about
              upcoming assignments, exams, and events to help you stay
              organized.
            </p>
          </div>
          <Separator orientation="vertical" className="hidden h-36 md:block" />
          <div className="relative flex h-[30rem] w-full flex-col overflow-hidden rounded-lg bg-background">
            <Marquee vertical className="[--duration:20s]" reverse>
              {notifications.map((notification, index) => (
                <Card
                  key={index}
                  className="flex w-full flex-col gap-2 p-4 text-xs md:text-base"
                >
                  <CardHeader className="flex flex-row items-center justify-between p-2">
                    <CardTitle>{notification.name}</CardTitle>
                    <CardDescription>{notification.time}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    {notification.description}
                  </CardContent>
                </Card>
              ))}
            </Marquee>
            <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
}

function AndMore() {
  const items = [
    "Customizable",
    "User Friendly",
    "Cross Platform",
    "Secure",
    "Intelligent",
    "Powerful",
    "Fast",
    "Reliable",
  ];
  return (
    <>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
        className="rotate-180"
      />
      <section className="-my-3 flex !w-full flex-col items-center justify-center gap-2 bg-muted/30 py-4">
        <Marquee className="w-full overflow-hidden [--gap:4rem]">
          {items.map((item, index) => (
            <span
              key={index}
              className="text-4xl font-bold text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </Marquee>
        <SquigglySeparator
          waveWidth={100}
          waveColor="hsla(var(--ui-muted) / 30%)"
        />
        <VelocityScroll
          text="And so much more"
          default_velocity={2}
          className="text-4xl font-bold text-muted-foreground"
        />
      </section>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
      />
    </>
  );
}

function Reveal() {
  return (
    <section className="flex min-h-[calc(100vh-4.5rem-1px)] !w-full flex-col items-center justify-center p-8">
      <div className="flex max-w-[100ch] flex-col items-center justify-center gap-8">
        <div className="sticky top-[calc(100%-4rem)] flex items-center gap-2 rounded-full bg-secondary/40 px-4 py-2 text-xs text-muted-foreground backdrop-blur-md">
          <ArrowDown />
          Keep Scrolling
        </div>
        <TextReveal text="Catalyst is the replacement you've been looking for 👀." />
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      review:
        "Catalyst is the best platform I've ever used. It has everything I need to succeed in my learning journey.",
    },
    {
      name: "Jane Doe",
      rating: 4,
      review:
        "I've been using Catalyst for a few months now, and I'm impressed with the results. It's definitely worth the investment.",
    },
    {
      name: "Alice",
      rating: 3,
      review:
        "Catalyst is a great platform for learning. It has a lot of features that make it easy to use and navigate.",
    },
    {
      name: "Bob",
      rating: 4,
      review:
        "I've been using Catalyst for a while now, and I'm really happy with the results. It's helped me improve my grades and stay organized.",
    },
    {
      name: "Eve",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It's easy to use, and it has a lot of features that make it easy to stay organized and on track.",
    },
    {
      name: "Charlie",
      rating: 4,
      review:
        "I've been using Catalyst for a few months now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "David",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It has a lot of features that make it easy to use and navigate, and it's helped me improve my grades.",
    },
    {
      name: "Grace",
      rating: 4,
      review:
        "I've been using Catalyst for a while now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Hannah",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It's easy to use, and it has a lot of features that make it easy to stay organized and on track.",
    },
    {
      name: "Isaac",
      rating: 4,
      review:
        "I've been using Catalyst for a few months now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Jack",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It has a lot of features that make it easy to use and navigate, and it's helped me improve my grades.",
    },
    {
      name: "Katie",
      rating: 4,
      review:
        "I've been using Catalyst for a while now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Liam",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It's easy to use, and it has a lot of features that make it easy to stay organized and on track.",
    },
    {
      name: "Mia",
      rating: 4,
      review:
        "I've been using Catalyst for a few months now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Noah",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It has a lot of features that make it easy to use and navigate, and it's helped me improve my grades.",
    },
    {
      name: "Olivia",
      rating: 4,
      review:
        "I've been using Catalyst for a while now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Peter",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It's easy to use, and it has a lot of features that make it easy to stay organized and on track.",
    },
    {
      name: "Quinn",
      rating: 4,
      review:
        "I've been using Catalyst for a few months now, and I'm really happy with the results. It's helped me stay organized and on track with my studies.",
    },
    {
      name: "Rachel",
      rating: 5,
      review:
        "Catalyst is a great platform for students. It has a lot of features that make it easy to use and navigate, and it's helped me improve my grades.",
    },
  ];
  return (
    <>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / .3)"
        fillColor="hsla(var(--ui-muted) / .3)"
        className="rotate-180"
      />
      <section className="-my-3 flex min-h-[20rem] !w-full flex-col items-center justify-center gap-8 bg-muted/30 py-8">
        <h2 className="h2 px-8">What our Users are Saying</h2>
        <p className="px-8 text-muted-foreground">
          These reviews are NOT from real users. They are generated for
          demonstration purposes only.
        </p>
        <div className="relative flex w-full flex-col items-center gap-2 md:hidden">
          <Marquee
            className="flex max-h-[20rem] max-w-full items-center overflow-hidden [--duration:100s] md:hidden"
            vertical
            reverse
          >
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="mx-auto flex w-[min(60ch,100%)] flex-col gap-2 p-4 text-xs md:text-base"
              >
                <CardHeader>
                  <CardTitle>{review.name}</CardTitle>
                  <CardDescription className="flex gap-2 pt-2">
                    {new Array(review.rating).fill(0).map((_, index) => (
                      <Star key={index} className="text-amber-500" />
                    ))}
                    {new Array(5 - review.rating).fill(0).map((_, index) => (
                      <Star key={index} className="text-muted-foreground" />
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>{review.review}</CardContent>
              </Card>
            ))}
          </Marquee>
        </div>
        <div className="hidden w-full flex-col gap-2 md:flex">
          <Marquee className="max-w-full overflow-hidden [--duration:100s]">
            {reviews
              .filter((_, i) => i <= 10)
              .map((review, index) => (
                <Card
                  key={index}
                  className="flex w-[60ch] flex-col gap-2 p-4 text-xs md:text-base"
                >
                  <CardHeader>
                    <CardTitle>{review.name}</CardTitle>
                    <CardDescription className="flex gap-2 pt-2">
                      {new Array(review.rating).fill(0).map((_, index) => (
                        <Star key={index} className="text-amber-500" />
                      ))}
                      {new Array(5 - review.rating).fill(0).map((_, index) => (
                        <Star key={index} className="text-muted-foreground" />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{review.review}</CardContent>
                </Card>
              ))}
          </Marquee>
          <Marquee
            className="max-w-full overflow-hidden [--duration:100s]"
            reverse
          >
            {reviews
              .filter((_, i) => i > 10 && i < 20)
              .map((review, index) => (
                <Card
                  key={index}
                  className="flex w-[60ch] flex-col gap-2 p-4 text-xs md:text-base"
                >
                  <CardHeader>
                    <CardTitle>{review.name}</CardTitle>
                    <CardDescription className="flex gap-2 pt-2">
                      {new Array(review.rating).fill(0).map((_, index) => (
                        <Star key={index} className="text-amber-500" />
                      ))}
                      {new Array(5 - review.rating).fill(0).map((_, index) => (
                        <Star key={index} className="text-muted-foreground" />
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{review.review}</CardContent>
                </Card>
              ))}
          </Marquee>
        </div>
      </section>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
      />
    </>
  );
}

function ProductImage() {
  return (
    <section className="flex min-h-[20rem] !w-full flex-col items-center justify-center gap-8 p-8 lg:flex-row">
      <ProductImageCarousel />
      <div className="mb-8 flex max-w-[60ch] flex-col gap-2">
        <h2 className="h2">Switch to Something Better</h2>
        <p>
          Catalyst is a modern platform that offers a wide range of features to
          help you succeed in your learning journey. With Catalyst, you can
          access your study materials, connect with classmates, and track your
          progress all in one place.
        </p>
      </div>
    </section>
  );
}

async function GetStarted() {
  return (
    <>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
        className="rotate-180"
      />
      <section className="-my-3 flex min-h-[10rem] !w-full flex-row items-center justify-center gap-2 bg-muted/30 p-8">
        <div className="flex w-[min(100ch,100%)] flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-4xl font-bold text-muted-foreground">
            Ready to start your Journey?
          </h2>
          <Suspense fallback={<Skeleton className="h-10 w-[10ch]" />}>
            <OpenApp />
          </Suspense>
        </div>
      </section>
      <SquigglySeparator
        waveWidth={100}
        waveColor="hsla(var(--ui-muted) / 30%)"
        fillColor="hsla(var(--ui-muted) / 30%)"
      />
    </>
  );
}

import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";

export default function TimelinePage() {
  return (
    <>
      <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-16">
        <div className="flex w-[min(80ch,100%)] flex-col gap-6">
          <h1 className="h1">About</h1>
          <p className="p">
            Catalyst was created with the vision of enhancing the learning
            experience for users of Canvas LMS. We set out to build more than
            just a client—an application that not only streamlines learning but
            also fosters connections and collaboration among students and
            educators. With a focus on intuitive design and powerful
            integrations, Catalyst is designed to transform the way you interact
            with your educational platform.
          </p>
          <p className="p">
            Our journey began with a commitment to developing a tool that truly
            meets the needs of its users. Throughout the development process, we
            continuously sought ways to improve, refine, and perfect every
            aspect of the application. This dedication to quality and innovation
            sets Catalyst apart, ensuring that our users have access to the most
            effective and enjoyable learning experience possible.
          </p>
          <p className="p">
            We also believe that quality education tools should be accessible to
            everyone. That{"'"}s why we are committed to offering reasonable
            pricing for our premium features, ensuring that Catalyst remains
            affordable. Additionally, we ensure that essential features that
            should be available to all users are included in our free plan,
            providing value without compromise.
          </p>
          <p className="p">
            Catalyst was developed by Drake Semchyshyn, whose passion for
            technology and education inspired the creation of this
            groundbreaking application. With a commitment to continuous
            improvement and user satisfaction, Drake and the Catalyst team are
            dedicated to pushing the boundaries of what a learning management
            system can offer.
          </p>
        </div>
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}

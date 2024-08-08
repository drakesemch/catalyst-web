import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TimelinePage() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Timeline</h1>
        <Button variant="secondary">New Post</Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <Avatar
                src="https://avatars.githubusercontent.com/u/3055950?v=4"
                alt="Avatar"
                className="mr-2 h-8 w-8"
              /> */}
              <div>
                <h2 className="text-lg font-bold">John Doe</h2>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div>
              <Button variant="secondary">Edit</Button>
            </div>
          </div>
          <div className="mt-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              eget semper nisl. Integer euismod, purus nec fringilla luctus,
              urna felis ultricies enim, nec tincidunt mi ex et nunc
            </p>
          </div>
          <div className="mt-4">
            <Image
              src="https://images.unsplash.com/photo-1532635246-202f2c3d1d6c"
              alt="Post Image"
              className="w-full rounded-lg"
              width={192}
              height={108}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <Button variant="link">Like</Button>
              <Button variant="link">Comment</Button>
              <Button variant="link">Share</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

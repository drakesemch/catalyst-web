"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  CalendarX2,
  Check,
  // CircleSlash,
  MoreHorizontal,
  Percent,
  // Plus,
  SquareArrowOutUpRight,
  UserPlus2,
  // UserRound,
  // UserX2,
} from "lucide-react";
// import { redirect } from "next/navigation";
import { toast } from "sonner";

export type NotificationMeta = {
  id: string;
  dismissed: boolean;
  data:
  | {
    type: "catalyst.friend-request" | "catalyst.friend-added";
    user: string;
  }
  | {
    type: "catalyst.schedule.add-date";
  }
  | {
    type: "canvas.grade-change";
    course: number;
    assignment: number;
    old: number;
    new: number;
  };
};

export type ToastData = {
  id: string;
};

export function newPopupNotification({
  notification,
}: {
  notification: NotificationMeta;
}) {
  toast.custom(
    () => (
      <div className="cursor-grab overflow-hidden rounded-lg border shadow-xl active:cursor-grabbing">
        <Notification notification={notification} toast={undefined} />
      </div>
    ),
    {
      id: notification.id,
    },
  );
}

export function Notification({
  notification,
  toast,
}: {
  notification: NotificationMeta;
  toast: ToastData | undefined;
}) {
  const { mutate: archiveMutation } =
    api.catalyst.user.notifications.archive.useMutation();
  let NotificationComponent = UnsupportedNotification;

  const archive = () => {
    archiveMutation({
      id: notification.id,
      dismissed: !(notification.dismissed ?? false),
    });
  };

  switch (notification.data.type) {
    default:
      break;
    case "canvas.grade-change":
      NotificationComponent =
        GradeChangeNotification as unknown as typeof UnsupportedNotification;
      break;
    case "catalyst.schedule.add-date":
      NotificationComponent =
        AddScheduleDateNotification as unknown as typeof UnsupportedNotification;
      break;
    case "catalyst.friend-request":
      NotificationComponent =
        FriendRequestNotification as unknown as typeof UnsupportedNotification;
      break;
    case "catalyst.friend-added":
      NotificationComponent =
        FriendAcceptedNotification as unknown as typeof UnsupportedNotification;
      break;
  }

  return (
    <NotificationComponent
      toastData={toast}
      notification={notification}
      archive={archive}
    />
  );
}

function UnsupportedNotification({
  toastData,
  notification,
  archive,
}: {
  toastData: ToastData | undefined;
  notification: { id: string; dismissed: boolean; data: { type: string } };
  archive: () => void;
}) {
  return (
    <div className="flex select-none flex-col gap-2 bg-background p-3 pl-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="flex-shrink-0" />
        <div className="flex flex-1 flex-col items-start">
          <span className="font-bold">Notification Render Error</span>
          <span className="text-xs text-muted-foreground">
            Notification with type {notification.data.type} is not supported.
          </span>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1 overflow-auto">
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            archive();
          }}
        >
          <Archive /> Archive
        </Button>
      </div>
    </div>
  );
}

function AddScheduleDateNotification({
  toastData,
  notification,
  archive,
}: {
  toastData: ToastData | undefined;
  notification: {
    id: string;
    dismissed: boolean;
    data: object;
  };
  archive: () => void;
}) {
  return (
    <div className="flex select-none flex-col gap-2 bg-background p-3 pl-4">
      <div className="flex items-center gap-2">
        <CalendarX2 className="flex-shrink-0" />
        <div className="flex flex-1 flex-col items-start">
          <span className="font-bold">Missing Schedule Data</span>
          <span className="text-xs text-muted-foreground">
            We are missing schedule data, please ensure that you are keeping up to date with the schedules, otherwise, we may transer your role to someone else.
          </span>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1 overflow-auto">
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
          }}
        >
          <SquareArrowOutUpRight /> Open Scheduling Information
        </Button>
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            archive();
          }}
        >
          {notification.dismissed ? (
            <>
              <ArchiveRestore /> Restore
            </>
          ) : (
            <>
              <Archive /> Archive
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function GradeChangeNotification({
  toastData,
  notification,
  archive,
}: {
  toastData: ToastData | undefined;
  notification: {
    id: string;
    dismissed: boolean;
    data: { course: number; assignment: number; old: number; new: number };
  };
  archive: () => void;
}) {
  const [assignment] = api.canvas.courses.get.assignments.get.useSuspenseQuery({
    courseId: notification.data.course,
    assignmentId: notification.data.assignment,
  });
  return (
    <div className="flex select-none flex-col gap-2 bg-background p-3 pl-4">
      <div className="flex items-center gap-2">
        <Percent className="flex-shrink-0" />
        <div className="flex flex-1 flex-col items-start">
          <span className="font-bold">{assignment.name} grade changed</span>
          <span className="text-xs text-muted-foreground">
            Grade changed from{" "}
            {notification.data.old == -1 ? "N/A" : notification.data.old} to{" "}
            {notification.data.new == -1 ? "N/A" : notification.data.new}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1 overflow-auto">
        <Button
          size="action"
          href={`/app/courses/${notification.data.course}/assignments/${notification.data.assignment}`}
          onClick={() => {
            toast.dismiss(toastData?.id);
          }}
        >
          <SquareArrowOutUpRight /> Open
        </Button>
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            archive();
          }}
        >
          {notification.dismissed ? (
            <>
              <ArchiveRestore /> Restore
            </>
          ) : (
            <>
              <Archive /> Archive
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function FriendRequestNotification({
  toastData,
  notification,
  archive,
}: {
  toastData: ToastData | undefined;
  notification: { id: string; dismissed: boolean; data: { user: string } };
  archive: () => void;
}) {
  const [user] = api.catalyst.user.friends.request.getDetails.useSuspenseQuery({
    id: notification.data.user,
  });
  return (
    <div className="flex select-none flex-col gap-2 bg-background p-3 pl-4">
      <div className="flex items-center gap-2">
        <UserPlus2 className="flex-shrink-0" />
        <div className="flex flex-1 flex-col items-start">
          <span className="font-bold">Incoming Friend Request</span>
          <span className="text-xs text-muted-foreground">
            {user?.name?.split(" ")[0]} requested to be your friend!
          </span>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1 overflow-auto">
        <Button
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            newPopupNotification({
              notification: {
                id: `accepted-${notification.id}`,
                dismissed: false,
                data: {
                  type: "catalyst.friend-added",
                  user: notification.data.user,
                },
              },
            });
          }}
        >
          <Check /> Accept
        </Button>
        <Button variant="outline" size="action">
          <MoreHorizontal /> Details
        </Button>
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            archive();
          }}
        >
          {notification.dismissed ? (
            <>
              <ArchiveRestore /> Restore
            </>
          ) : (
            <>
              <Archive /> Archive
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function FriendAcceptedNotification({
  toastData,
  notification,
  archive,
}: {
  toastData: ToastData | undefined;
  notification: { id: string; data: { user: string } };
  archive: () => void;
}) {
  const [user] = api.catalyst.user.friends.request.getDetails.useSuspenseQuery({
    id: notification.data.user,
  });
  return (
    <div className="flex select-none flex-col gap-2 bg-background p-3 pl-4">
      <div className="flex items-center gap-2">
        <UserPlus2 className="flex-shrink-0" />
        <div className="flex flex-1 flex-col items-start">
          <span className="font-bold">Friend Request Accepted</span>
          <span className="text-xs text-muted-foreground">
            You are now friends with {user?.name?.split(" ")[0]}!
          </span>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1 overflow-auto">
        <Button
          variant="outline"
          size="action"
          onClick={() => {
            toast.dismiss(toastData?.id);
            archive();
          }}
        >
          <Archive /> Archive
        </Button>
      </div>
    </div>
  );
}

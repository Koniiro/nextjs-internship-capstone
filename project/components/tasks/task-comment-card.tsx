"use client"
import { useDBUser } from "@/hooks/use-users";
import { Comment, User } from "@/types";
import { useUser } from "@clerk/nextjs";
import { Avatar,AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";


type taskCommentCardProps = {
    userId: string;
    commentData:Comment
};
function timeAgo(dateString: Date) {
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diff = Math.floor((now - past) / 1000); // seconds difference

  if (diff < 60) {
    return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  // 7 days or more → show local string
  return new Date(dateString).toLocaleString();
}


export default function TaskCommentCard({userId,commentData}:taskCommentCardProps){
    const {user, isLoading,error} =useDBUser(userId)
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Failed to load user {error.message}</p>;
    if (!user) return <p>Failed to load user</p>;
    return <div className="flex flex-col border px-5 py-2 w-auto border-blue-900 rounded-md text-wrap">
        <div className="flex flex-row gap-2 items-center">
            <Avatar className="h-5 w-5 rounded-full border-outer_space-200 border">
              <AvatarImage src={user.avatarURL ?? undefined}  className="h-5 w-5  rounded-full object-cover object-center"/>
              <AvatarFallback className="rounded-full">{user.firstName && user.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`
                : "人"}</AvatarFallback>
            </Avatar>
            <h2 className="font-bold text-base text-blue-900">{user.firstName} {user.lastName} </h2>
            <p>•</p>
            <p>{timeAgo(commentData.created_at)}
            </p>
        </div>
        <div className="text-wrap text-justify text-gray-800">
            {commentData.content}
        </div >
    </div>

}
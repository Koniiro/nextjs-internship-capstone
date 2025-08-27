import { Comment, User } from "@/types";



type taskCommentCardProps = {
    userId: string;
    commentData:Comment
};


export default function TaskCommentCard({userId,commentData}:taskCommentCardProps){
    return <div className="flex flex-col border px-5 py-2 w-auto border-blue-900 rounded-md text-wrap">
        <div className="flex flex-row gap-2 ">
            <h2 className="font-bold text-base text-blue-900">User </h2>
            <p>•</p>
            <p>{Math.floor(
                    (Date.now() - new Date(commentData.created_at).getTime()) / (1000 * 60 * 60 * 24)
                )} days ago
            </p>
        </div>
        <div className="text-wrap text-justify text-gray-800">
            {commentData.content}
        </div >
    </div>

}
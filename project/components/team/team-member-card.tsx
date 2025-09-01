import { MoreHorizontal, UserRoundPen, UserRoundX,UserRoundCog  } from "lucide-react"
import { Dialog } from "../ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { useClerkUser, useDBUser } from "@/hooks/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { userRoles } from "@/lib/constants";
import { useTeamMembers } from "@/hooks/use-team-members";
import { Badge } from "../ui/badge";
import { AlertDialogTrigger,AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface TeamMemberCardProps{
    userID:string
    teamId: string
    role:string
    userPermissions:boolean
    isTeamManager:boolean
    teamCreator:boolean
  
    joinedAt: Date
}

export default function TeamMemberCard({userPermissions,userID,teamId,role,isTeamManager,teamCreator}:TeamMemberCardProps){
    let { user,userLoading,userError} = useDBUser(userID);
    let {clerkUser,clerkUserLoading,clerkUserError} = useClerkUser()
    const[openDiag,setOpenDiag] = useState(false)
    let {removeTeamMember,updateMemberRole,updateTeamMemberMGT} =useTeamMembers(teamId)
    const error=userError||clerkUserError
    if (userLoading|| clerkUserLoading) return <p>Loading...</p>;
    if (error) return <p>Failed to load user {error.message}</p>;
    if (!user||!clerkUser) return <p>Failed to load user data</p>;
    console.log(user?.firstName,isTeamManager)

    const isUser=userID===clerkUser.id
    const roleChangeHandler = async (role:string) => { 
        await updateMemberRole(userID,role)
    }

    const permChangeHandler = async (manager:boolean) => { 
        await updateTeamMemberMGT(userID,manager)
    }

    const removeUserHandler = async () => { 
        await removeTeamMember(user.id)
    }
    return <div
    className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
    >
        <div className="flex items-start justify-between ">
            <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 rounded-full border-outer_space-200 border">
                    <AvatarImage src={user.avatarURL ?? undefined}  className="h-12 w-12  rounded-full object-cover object-center"/>
                    <AvatarFallback className="rounded-full">{user.firstName && user.lastName
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : "人"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <div>
                        <h3 className="font-bold text-lg text-outer_space-500 dark:text-platinum-500">{user.firstName} {user.lastName}</h3>
                        <p className="captalize text-sm font-semibold text-payne's_gray-500 dark:text-french_gray-400">{role}</p>
                        
                    </div>
                </div>
            </div>
            {userPermissions &&(
                <DropdownMenu open={openDiag} onOpenChange={setOpenDiag}>
                <DropdownMenuTrigger ><MoreHorizontal size={16} /></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer flex flex-row items-center gap-2"> <UserRoundPen size={16}/>Change User Role</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                            <DropdownMenuSubContent  className="bg-white">
                                <DropdownMenuLabel> Choose New Role</DropdownMenuLabel>
                                {Object.entries(userRoles).map(([key, value]) => (
                                    <DropdownMenuCheckboxItem
                                        key={key}
                                        checked={value === role}
                                        onCheckedChange={() => roleChangeHandler(value)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex flex-row items-center gap-2">
                                        {value}
                                        </div>
                                    </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        {(!isUser && !isTeamManager) && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                    <UserRoundX size={16} />
                                    Remove
                                </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Remove this member?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. The user will lose all access to this team and all its projects.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={removeUserHandler}>
                                    Yes, Remove.
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {!isUser && (
                            isTeamManager ? (
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer flex flex-row items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                    >
                                    <UserRoundX size={16} />
                                    Demote to Member
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Remove this user's Team Manager permissions?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will remove this user's ability to manage team members.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => permChangeHandler(false)}>
                                        Yes, Demote
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="cursor-pointer flex flex-row items-center gap-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                                    >
                                    <UserRoundCog size={16} />
                                    Assign as Team Manager
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Assign user as a Team Manager?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will grant the user additional permissions to manage
                                        team members.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => permChangeHandler(true)}>
                                        Yes, Assign
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            )
                            )}


                    </DropdownMenuGroup>

                    
                </DropdownMenuContent>
                </DropdownMenu>
            )}   
            
        </div>

        <Separator className="my-2  bg-outer_space-200 " />
        <div className="flex flex-col gap-2 my-2">
            <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">{user.email}</p>
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        @{user.userName}
                    </span>

                    {teamCreator && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Team Creator
                        </span>
                        )}

                    {isTeamManager && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            TM
                        </span>
                    )}
                </div>
                
                <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                    0 Tasks
                </div>
            </div>
        </div>                     
    </div>
}
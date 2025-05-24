// components/profile/ProfileHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    image?: string | null;
    role: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-4 p-4 bg-card rounded-lg shadow">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.image || ""} alt={user.name || "Пользователь"} />
        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.name || "Пользователь"}</h1>
        <p className="text-muted-foreground">{user.role}</p>
      </div>
    </div>
  );
}
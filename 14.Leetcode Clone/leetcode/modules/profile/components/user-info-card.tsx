import React from "react";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserInfoCard = ({ userData }: any) => {
  if (!userData) return null;

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden select-none">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-violet-500/20 shadow-md">
              <AvatarImage
                src={userData.imageUrl}
                alt={`${userData.firstName} ${userData.lastName}`}
              />
              <AvatarFallback className="text-xl font-bold font-mono bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300">
                {userData.firstName?.[0] || "U"}
                {userData.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-lg p-1.5 shadow-md border border-white dark:border-zinc-950">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-zinc-50 uppercase">
                {userData.firstName} {userData.lastName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                <Mail className="w-3.5 h-3.5 stroke-[2]" />
                <span className="text-xs font-semibold break-all">
                  {userData.email}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400 dark:text-zinc-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Active {formatDate(userData.updatedAt)}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] font-extrabold tracking-widest uppercase px-2 rounded-md ${
                  userData.role === "ADMIN"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    : "bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800"
                }`}
              >
                {userData.role || "USER"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;

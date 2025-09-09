"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Role = "buyer" | "seller" | "admin";

interface RoleSwitcherProps {
  onRoleChange?: (role: Role) => void;
}

export default function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("buyer");

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    onRoleChange?.(role);
  };

  const roleLabels: Record<Role, string> = {
    buyer: "구매자",
    seller: "판매자",
    admin: "관리자",
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-600">역할 선택:</span>
      
      <div className="flex gap-2">
        {(Object.keys(roleLabels) as Role[]).map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => handleRoleChange(role)}
            className={
              selectedRole === role
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "border-border hover:bg-teal-50 hover:border-teal-300"
            }
          >
            {roleLabels[role]}
          </Button>
        ))}
      </div>

      {selectedRole && (
        <Badge 
          variant="secondary"
          className="bg-teal-300/30 text-teal-700 border-teal-300/50"
        >
          현재: {roleLabels[selectedRole]}
        </Badge>
      )}
    </div>
  );
}
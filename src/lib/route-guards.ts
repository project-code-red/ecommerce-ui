"use client";

import { redirect } from "next/navigation";
import { isAuthenticated, isAdmin } from "./auth";

export const requireAuth = () => {
  if (!isAuthenticated()) {
    redirect("/login");
  }
};

export const requireAdmin = () => {
  if (!isAuthenticated() || !isAdmin()) {
    redirect("/login");
  }
};


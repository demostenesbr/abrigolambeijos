import Main from "../pages/login/main";
import React, { Suspense } from "react";

export default function LoginPage() {
  return React.createElement(Suspense, null, React.createElement(Main));
}
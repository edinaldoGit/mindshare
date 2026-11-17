import { createContext, useContext } from "react";
import type { Activity, DemoState, Enrollment, User } from "@/types/domain";
import type { ProposalInput } from "@/lib/demo/state";
import type { LoginAttempts } from "@/features/auth/auth-rules";
export interface DemoContextValue {
  user: User | null;
  state: DemoState;
  storageNotice: string;
  enroll: (activityId: string) => { ok: boolean; message: string };
  createProposal: (input: ProposalInput) => {
    ok: boolean;
    id?: string;
    message: string;
  };
  submitProposal: (proposalId: string) => { ok: boolean; message: string };
  updateProposal: (
    proposalId: string,
    input: ProposalInput,
  ) => { ok: boolean; message: string };
  completeEnrollment: (enrollmentId: string) => {
    ok: boolean;
    message: string;
  };
  approveProposal: (proposalId: string) => { ok: boolean; message: string };
  rejectProposal: (
    proposalId: string,
    reason: string,
  ) => { ok: boolean; message: string };
  requestAdjustments: (
    proposalId: string,
    reason: string,
  ) => { ok: boolean; message: string };
  resetDemo: () => void;
  run: (
    operation: (
      state: DemoState,
      actor: User | null,
    ) => { ok: boolean; state: DemoState; message: string; id?: string },
  ) => { ok: boolean; message: string; id?: string };
  activities: Activity[];
  enrollments: Enrollment[];
  users: User[];
  attempts: LoginAttempts;
  signIn: (
    email: string,
    password: string,
  ) => { ok: true; user: User } | { ok: false; message: string };
  signInStudent: () => void;
  signOut: () => void;
}
export const DemoContext = createContext<DemoContextValue | null>(null);
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo precisa do DemoProvider");
  return value;
}

import { useRef, useState, type ReactNode } from "react";
import { demoStudent } from "@/data/demo-data";
import {
  authenticateDemo,
  recordInvalidAttempt,
  type LoginAttempts,
} from "@/features/auth/auth-rules";
import type { User } from "@/types/domain";
import { DemoContext } from "./demo-context";
import {
  enrollInActivity,
  createInitialState,
  createProposal as createProposalCommand,
  submitProposal as submitProposalCommand,
  updateProposal as updateProposalCommand,
  confirmEnrollmentCompletion,
  approveProposal as approveProposalCommand,
  rejectProposal as rejectProposalCommand,
  requestProposalAdjustments,
  type ProposalInput,
} from "@/lib/demo/state";
import { loadDemoState, saveDemoState } from "@/lib/demo/storage";
import type { DemoState } from "@/types/domain";
function localDemoStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
const sessionKey = "mindshare:demo:session:v1";
function readSession(users: User[]): User | null {
  try {
    const id = sessionStorage.getItem(sessionKey);
    return users.find((user) => user.id === id) ?? null;
  } catch {
    return null;
  }
}
function saveSession(user: User | null) {
  try {
    if (user) sessionStorage.setItem(sessionKey, user.id);
    else sessionStorage.removeItem(sessionKey);
  } catch {
    /* A sessão em memória permanece disponível. */
  }
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [boot] = useState(() => loadDemoState(localDemoStorage()));
  const [state, setState] = useState<DemoState>(boot.state);
  const stateRef = useRef(boot.state);
  const [storageNotice, setStorageNotice] = useState(boot.notice);
  const [sessionUser, setUser] = useState<User | null>(() =>
    readSession(boot.state.users),
  );
  const user = state.users.find((u) => u.id === sessionUser?.id) ?? null;
  const [attempts, setAttempts] = useState<LoginAttempts>({
    failures: 0,
    blockedUntil: 0,
  });
  function startSession(nextUser: User | null) {
    setUser(nextUser);
    saveSession(nextUser);
  }
  function signIn(
    email: string,
    password: string,
  ): { ok: true; user: User } | { ok: false; message: string } {
    const now = Date.now();
    if (attempts.blockedUntil > now)
      return {
        ok: false,
        message:
          "Acesso demonstrativo pausado por 15 minutos após 5 tentativas inválidas.",
      };
    const nextUser = authenticateDemo(email, password, stateRef.current.users);
    if (!nextUser) {
      const nextAttempts = recordInvalidAttempt(attempts, now);
      setAttempts(nextAttempts);
      return {
        ok: false,
        message:
          nextAttempts.blockedUntil > now
            ? "Após 5 tentativas inválidas, o acesso demonstrativo foi pausado por 15 minutos."
            : "E-mail ou senha de demonstração incorretos. Verifique os dados e tente novamente.",
      };
    }
    setAttempts({ failures: 0, blockedUntil: 0 });
    startSession(nextUser);
    return { ok: true, user: nextUser };
  }
  function commit(nextState: DemoState) {
    stateRef.current = nextState;
    setState(nextState);
    setStorageNotice(
      saveDemoState(localDemoStorage(), nextState)
        ? ""
        : "A alteração foi aplicada nesta aba, mas não foi possível salvá-la. Ela pode ser perdida ao recarregar.",
    );
  }
  function enroll(activityId: string) {
    const result = enrollInActivity(
      stateRef.current,
      user,
      activityId,
      new Date().toISOString(),
      crypto.randomUUID(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function createProposal(input: ProposalInput) {
    const result = createProposalCommand(
      stateRef.current,
      user,
      input,
      new Date().toISOString(),
      crypto.randomUUID(),
    );
    if (result.ok) commit(result.state);
    return {
      ok: result.ok,
      ...(result.ok ? { id: result.activity.id } : {}),
      message: result.message,
    };
  }
  function submitProposal(proposalId: string) {
    const result = submitProposalCommand(
      stateRef.current,
      user,
      proposalId,
      new Date().toISOString(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function updateProposal(proposalId: string, input: ProposalInput) {
    const result = updateProposalCommand(
      stateRef.current,
      user,
      proposalId,
      input,
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function completeEnrollment(enrollmentId: string) {
    const result = confirmEnrollmentCompletion(
      stateRef.current,
      user,
      enrollmentId,
      new Date().toISOString(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function approveProposal(proposalId: string) {
    const result = approveProposalCommand(
      stateRef.current,
      user,
      proposalId,
      new Date().toISOString(),
      crypto.randomUUID(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function rejectProposal(proposalId: string, reason: string) {
    const result = rejectProposalCommand(
      stateRef.current,
      user,
      proposalId,
      reason,
      new Date().toISOString(),
      crypto.randomUUID(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function requestAdjustments(proposalId: string, reason: string) {
    const result = requestProposalAdjustments(
      stateRef.current,
      user,
      proposalId,
      reason,
      new Date().toISOString(),
      crypto.randomUUID(),
    );
    if (result.ok) commit(result.state);
    return { ok: result.ok, message: result.message };
  }
  function resetDemo() {
    commit(createInitialState());
  }
  return (
    <DemoContext
      value={{
        user,
        state,
        activities: state.activities,
        enrollments: state.enrollments,
        storageNotice,
        enroll,
        createProposal,
        submitProposal,
        updateProposal,
        completeEnrollment,
        approveProposal,
        rejectProposal,
        requestAdjustments,
        resetDemo,
        run: (operation) => {
          const result = operation(stateRef.current, user);
          if (result.ok) commit(result.state);
          return { ok: result.ok, message: result.message, id: result.id };
        },
        users: state.users,
        attempts,
        signIn,
        signInStudent: () => startSession(demoStudent),
        signOut: () => {
          startSession(null);
          setAttempts({ failures: 0, blockedUntil: 0 });
        },
      }}
    >
      {children}
    </DemoContext>
  );
}

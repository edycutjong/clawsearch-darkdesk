export type SweepStatus =
  | "queued"
  | "cloning"
  | "ast"
  | "ai_loop"
  | "testing"
  | "pr_open"
  | "complete"
  | "failed";

export type LogLevel = "info" | "success" | "error" | "warn" | "ai";

export interface SweepRow {
  id: string;
  repo_url: string;
  repo_name: string;
  status: SweepStatus;
  pr_url: string | null;
  files_changed: number;
  ast_fixes: number;
  ai_fixes: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LogRow {
  id: string;
  sweep_id: string;
  level: LogLevel;
  message: string;
  created_at: string;
}

/** Composed type for the dashboard / detail views */
export interface Sweep {
  id: string;
  repoUrl: string;
  repoName: string;
  status: SweepStatus;
  prUrl: string | null;
  filesChanged: number;
  astFixes: number;
  aiFixes: number;
  logs: LogEntry[];
  startedAt: string;
  completedAt: string | null;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

/** Transform DB rows → frontend shape */
export function toSweep(row: SweepRow, logs: LogRow[]): Sweep {
  return {
    id: row.id,
    repoUrl: row.repo_url,
    repoName: row.repo_name,
    status: row.status,
    prUrl: row.pr_url,
    filesChanged: row.files_changed,
    astFixes: row.ast_fixes,
    aiFixes: row.ai_fixes,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    logs: logs.map((l) => ({
      timestamp: l.created_at,
      level: l.level,
      message: l.message,
    })),
  };
}

/** Insert types (id, timestamps are auto-generated) */
export type SweepInsert = Omit<SweepRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type LogInsert = Omit<LogRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

/**
 * Minimal Supabase Database type for the client.
 * Only covers ClawSearchDarkDesk tables. Conforms to the GenericSchema shape
 * required by @supabase/supabase-js v2.103+.
 */
export interface Database {
  public: {
    Tables: {
      clawsearchdarkdesk_sweeps: {
        Row: SweepRow;
        Insert: SweepInsert;
        Update: Partial<SweepRow>;
        Relationships: [
          {
            foreignKeyName: "clawsearchdarkdesk_logs_sweep_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "clawsearchdarkdesk_logs";
            referencedColumns: ["sweep_id"];
          },
        ];
      };
      clawsearchdarkdesk_logs: {
        Row: LogRow;
        Insert: LogInsert;
        Update: Partial<LogRow>;
        Relationships: [
          {
            foreignKeyName: "clawsearchdarkdesk_logs_sweep_id_fkey";
            columns: ["sweep_id"];
            isOneToOne: false;
            referencedRelation: "clawsearchdarkdesk_sweeps";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

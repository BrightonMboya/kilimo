function required(name: string): string {
  const v = process.env[name];
  if (!v || v.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  GEE_SA_EMAIL: required("GEE_SA_EMAIL"),
  // Support both escaped newlines (\\n) and real newlines; Vercel env pastes tend
  // to come in as literal \n sequences.
  GEE_SA_PRIVATE_KEY: required("GEE_SA_PRIVATE_KEY").replace(/\\n/g, "\n"),
  GEE_PROJECT_ID: required("GEE_PROJECT_ID"),
  GROQ_API_KEY: optional("GROQ_API_KEY"),
};

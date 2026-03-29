import {
  type Application,
  type ApplicationFullView,
  type ApplicationStatus,
  type Cluster,
  type User,
  type UserRole,
} from "@/shared/types/applications";

type NewApplicationInput = {
  user: User;
  cluster: Cluster;
  tags?: string[];
  ai_recommendation?: any;
};

const now = (): string => new Date().toISOString();

/**
 * In-memory mocks. In a real app this would be API-driven.
 */
const users: User[] = [
  {
    id: "user-001",
    first_name: "Amina",
    last_name: "Rahman",
    birth_date: "2008-03-11",
    avatar: "https://cdn.example.com/avatars/amina.jpg",
    role: "abiturient",
    email: "amina.rahman@example.com",
    created_at: "2026-02-11T09:00:00Z",
  },
  {
    id: "user-002",
    first_name: "Mateo",
    last_name: "Alvarez",
    birth_date: "2007-07-02",
    avatar: "https://cdn.example.com/avatars/mateo.jpg",
    role: "abiturient",
    email: "mateo.alvarez@example.com",
    created_at: "2026-02-14T12:00:00Z",
  },
  {
    id: "user-003",
    first_name: "Ifeoma",
    last_name: "Okeke",
    birth_date: "2007-11-19",
    avatar: "https://cdn.example.com/avatars/ifeoma.jpg",
    role: "abiturient",
    email: "ifeoma.okeke@example.com",
    created_at: "2026-02-10T17:00:00Z",
  },
  {
    id: "user-committee-001",
    first_name: "Lena",
    last_name: "Volkova",
    birth_date: "1991-05-22",
    avatar: "https://cdn.example.com/avatars/committee-lena.jpg",
    role: "committee",
    email: "lena.volkova@invision-u.edu",
    created_at: "2026-01-20T09:00:00Z",
  },
];

const clusters: Cluster[] = [
  {
    id: "cluster-001",
    interview_video_url: "https://cdn.example.com/interviews/amina.mp4",
    essay_document_url: "https://cdn.example.com/essays/amina.pdf",
  },
  {
    id: "cluster-002",
    interview_video_url: "https://cdn.example.com/interviews/mateo.mp4",
    essay_document_url: "https://cdn.example.com/essays/mateo.pdf",
  },
  {
    id: "cluster-003",
    interview_video_url: "https://cdn.example.com/interviews/ifeoma.mp4",
    essay_document_url: "https://cdn.example.com/essays/ifeoma.pdf",
  },
];

const applications: Application[] = [
  {
    id: "app-001",
    abitur_id: "user-001",
    cluster_id: "cluster-001",
    status: "pending",
    tags: ["climate", "leadership", "high-potential"],
    ai_recommendation: {
      totalScore: 88,
      aiProbability: 14,
      metrics: {
        leadership: 91,
        resilience: 89,
        techBase: 84,
        socialImpact: 90,
        growthDelta: 86,
      },
      explainability: {
        reasoning:
          "Высокая инициативность и устойчивость в условиях нехватки ресурсов. Техническая база практическая.",
        flags: ["Strong early leadership evidence", "Context-specific impact"],
      },
      keyMilestones: [
        "Карта безопасных маршрутов",
        "Круг репетиторства для 40+ учеников",
        "Прототип логгирования осадков",
      ],
    },
    created_at: "2026-02-11T09:30:00Z",
  },
  {
    id: "app-002",
    abitur_id: "user-002",
    cluster_id: "cluster-002",
    status: "pending",
    tags: ["hardware", "resilience"],
    ai_recommendation: {
      totalScore: 79,
      aiProbability: 22,
      metrics: {
        leadership: 73,
        resilience: 85,
        techBase: 82,
        socialImpact: 76,
        growthDelta: 80,
      },
      explainability: {
        reasoning:
          "Хорошая кривая обучения и техническое исполнение. Лидерство формируется.",
        flags: ["Failure-to-improvement narrative", "Solid technical baseline"],
      },
      keyMilestones: [
        "Ревизия робота после сбоя",
        "6 локальных хакатонов",
        "Датчики качества воздуха в школах",
      ],
    },
    created_at: "2026-02-14T13:10:00Z",
  },
  {
    id: "app-003",
    abitur_id: "user-003",
    cluster_id: "cluster-003",
    status: "considering",
    tags: ["education", "community", "approved-track"],
    ai_recommendation: {
      totalScore: 92,
      aiProbability: 11,
      metrics: {
        leadership: 94,
        resilience: 90,
        techBase: 81,
        socialImpact: 96,
        growthDelta: 88,
      },
      explainability: {
        reasoning:
          "Сильный социальный эффект с измеримыми результатами, зрелое лидерство.",
        flags: ["High social impact", "Consistent leadership evidence"],
      },
      keyMilestones: [
        "Клуб чтения: рост с 4 до 60",
        "Модель wellbeing check-in",
        "Дашборд аналитики для поддержки",
      ],
    },
    created_at: "2026-02-10T17:45:00Z",
  },
];

const views: ApplicationFullView[] = applications.map((application) => {
  const user = users.find((u) => u.id === application.abitur_id)!;
  const cluster = clusters.find((c) => c.id === application.cluster_id)!;
  return { application, user, cluster };
});

/**
 * Helpers
 */
export const getUsersByRole = (role?: UserRole): User[] => {
  if (!role) return users;
  return users.filter((u) => u.role === role);
};

export const getUserByEmail = (email: string): User | undefined =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

export const getApplications = (): ApplicationFullView[] => views;

export const getApplicationById = (
  id: string,
): ApplicationFullView | undefined =>
  views.find((v) => v.application.id === id);

export const filterApplicationsByDate = (
  from?: string,
  to?: string,
): ApplicationFullView[] => {
  const fromTs = from ? new Date(from).getTime() : -Infinity;
  const toTs = to ? new Date(to).getTime() : Infinity;
  return views.filter((v) => {
    const ts = new Date(v.application.created_at).getTime();
    return ts >= fromTs && ts <= toTs;
  });
};

const setStatus = (
  id: string,
  status: ApplicationStatus,
): ApplicationFullView | undefined => {
  const view = getApplicationById(id);
  if (!view) return undefined;
  view.application.status = status;
  return view;
};

/**
 * State machine helpers
 */
export const markConsidering = (
  id: string,
): ApplicationFullView | undefined => {
  const view = getApplicationById(id);
  if (!view) return undefined;
  if (view.application.status === "pending") {
    return setStatus(id, "considering");
  }
  return view;
};

export const approveApplication = (
  id: string,
): ApplicationFullView | undefined => {
  const view = markConsidering(id) ?? getApplicationById(id);
  if (!view) return undefined;
  if (view.application.status === "considering") {
    return setStatus(id, "approved");
  }
  return view;
};

export const denyApplication = (
  id: string,
): ApplicationFullView | undefined => {
  const view = markConsidering(id) ?? getApplicationById(id);
  if (!view) return undefined;
  if (view.application.status === "considering") {
    return setStatus(id, "denied");
  }
  return view;
};

export const revokeApplication = (
  id: string,
): ApplicationFullView | undefined => {
  const view = getApplicationById(id);
  if (!view) return undefined;
  if (view.application.status === "pending") {
    return setStatus(id, "revoken");
  }
  return view;
};

/**
 * Applicant flow: create new application (pending)
 */
export const createApplication = (
  input: NewApplicationInput,
): ApplicationFullView => {
  const application: Application = {
    id: `app-${Math.random().toString(36).slice(2, 8)}`,
    abitur_id: input.user.id,
    cluster_id: input.cluster.id,
    status: "pending",
    tags: input.tags ?? [],
    ai_recommendation: input.ai_recommendation ?? {},
    created_at: now(),
  };

  // Upsert mocks to keep consistency
  const existingUser = users.find((u) => u.id === input.user.id);
  if (!existingUser) users.push(input.user);
  const existingCluster = clusters.find((c) => c.id === input.cluster.id);
  if (!existingCluster) clusters.push(input.cluster);

  applications.push(application);
  const view: ApplicationFullView = {
    application,
    user: input.user,
    cluster: input.cluster,
  };
  views.push(view);
  return view;
};

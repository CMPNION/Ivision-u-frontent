import { getApplications } from "@/shared/api/mockApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import ApplicationList from "@/widgets/applications/ui/application-list";

export default function DashboardPage(): React.JSX.Element {
  const applications = getApplications();

  const stats = applications.reduce(
    (acc, { application }) => {
      acc.total += 1;
      acc[application.status] = (acc[application.status] ?? 0) + 1;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      revoken: 0,
      considering: 0,
      denied: 0,
      approved: 0,
    } as Record<string, number>,
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Дашборд приёмной комиссии
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Строгий поток: pending → considering → approved | denied (или pending
          → revoken со стороны абитуриента). Просмотр заявки переводит статус в
          &ldquo;considering&rdquo;.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Всего заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">
              {String(stats.total).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm text-slate-500">Все статусы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ожидают / Рассматриваются</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-amber-500">
              {String(stats.pending + stats.considering).padStart(2, "0")}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              pending: {stats.pending} • considering: {stats.considering}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Результаты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-[#c1f11d]">Одобрены</span>
              <span className="font-semibold text-slate-900">
                {String(stats.approved).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-rose-600">Отклонены</span>
              <span className="font-semibold text-slate-900">
                {String(stats.denied).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Отозваны</span>
              <span className="font-semibold text-slate-900">
                {String(stats.revoken).padStart(2, "0")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ApplicationList />
    </section>
  );
}

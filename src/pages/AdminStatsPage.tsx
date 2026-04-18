import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const STATS_URL = "https://functions.poehali.dev/1030bf58-d093-46a2-94a8-a21bc3d1ea4d";
const TOKEN_KEY = "art_admin_token";

type DayStat = {
  date: string;
  cache_hits: number;
  ai_calls: number;
  total: number;
  saved_pct: number;
};

type Summary = {
  total_messages: number;
  total_cache: number;
  total_ai: number;
  saved_pct: number;
};

const AdminStatsPage = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) || "");
  const [inputToken, setInputToken] = useState("");
  const [days, setDays] = useState<DayStat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(STATS_URL, {
        headers: { "X-Admin-Token": t },
      });
      if (res.status === 401) {
        setError("Неверный токен");
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        return;
      }
      if (!res.ok) {
        setError("Ошибка загрузки");
        return;
      }
      const data = await res.json();
      setDays(data.days || []);
      setSummary(data.summary || null);
    } catch (e) {
      setError("Нет соединения");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadStats(token);
  }, [token]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    localStorage.setItem(TOKEN_KEY, inputToken.trim());
    setToken(inputToken.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setDays([]);
    setSummary(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Lock" size={20} />
              Вход в админку
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="token">Токен доступа</Label>
                <Input
                  id="token"
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="Введите ADMIN_TOKEN"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = [...days].reverse().map((d) => ({
    date: d.date.slice(5),
    "Из кеша": d.cache_hits,
    "Через ИИ": d.ai_calls,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Статистика чата</h1>
            <p className="text-gray-500 text-sm">Экономия вычислительного времени за 30 дней</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>

        {loading && <p className="text-gray-500">Загрузка...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Всего сообщений
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{summary.total_messages}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Из кеша
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{summary.total_cache}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Через ИИ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{summary.total_ai}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 font-normal">
                  Экономия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-600">{summary.saved_pct}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>График по дням</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Из кеша" stackId="a" fill="#10b981" />
                    <Bar dataKey="Через ИИ" stackId="a" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {days.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Таблица</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-2 pr-4">Дата</th>
                      <th className="py-2 pr-4">Всего</th>
                      <th className="py-2 pr-4 text-green-600">Из кеша</th>
                      <th className="py-2 pr-4 text-blue-600">Через ИИ</th>
                      <th className="py-2 pr-4">Экономия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((d) => (
                      <tr key={d.date} className="border-b hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium">{d.date}</td>
                        <td className="py-2 pr-4">{d.total}</td>
                        <td className="py-2 pr-4 text-green-600">{d.cache_hits}</td>
                        <td className="py-2 pr-4 text-blue-600">{d.ai_calls}</td>
                        <td className="py-2 pr-4">{d.saved_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && days.length === 0 && !error && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-40" />
              Пока нет данных — сообщения ещё не приходили.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminStatsPage;

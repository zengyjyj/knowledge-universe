import { Profile } from "@/data/types/database";

export default function Overview({ profile }: { profile: Profile }) {
  const initial = profile.username?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          欢迎回来，{profile.username}
        </h1>
        <p className="mt-2 text-white/60">今天也来探索一点新知识吧 ✨</p>
      </section>

      {/* Profile Card */}
      <section className="rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl">
        <div className="flex items-center gap-6">
          {/* Image */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold">{initial}</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold">{profile.username}</h2>
            {profile.mail && (
              <p className="text-white/60 text-sm">{profile.mail}</p>
            )}

            {/* Level */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-white/60 mb-1">
                {/* TODO:later */}
                <span>Lv.3 · 星际探索者</span>
                <span>75%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-pink-400 to-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <StatCard
          label="学习天数"
          value="15"
          color="from-blue-500 to-cyan-400"
        />
        <StatCard
          label="完成目标"
          value="8"
          color="from-green-500 to-emerald-400"
        />
        <StatCard
          label="已收藏内容"
          value="23"
          color="from-yellow-500 to-orange-400"
        />
        <StatCard
          label="学习时长"
          value="42h"
          color="from-pink-500 to-purple-500"
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 transition">
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} mb-4`} />
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-white/60 mt-1">{label}</div>
    </div>
  );
}

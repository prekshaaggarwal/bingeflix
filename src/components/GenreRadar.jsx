const ALL_GENRES = ['Sci-Fi', 'Action', 'Romance', 'Drama', 'Comedy', 'Horror', 'Documentary'];

export default function GenreRadar({ watched }) {
  const counts = {};
  ALL_GENRES.forEach(g => { counts[g] = 0; });
  watched.forEach(m => { if (counts[m.genre] !== undefined) counts[m.genre]++; });

  const max = Math.max(...Object.values(counts), 1);
  const genres = ALL_GENRES;
  const n = genres.length;
  const cx = 140, cy = 140, R = 110;

  const angleOf = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i, r) => {
    const a = angleOf(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = genres.map((g, i) => pointAt(i, (counts[g] / max) * R));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

  if (watched.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Watch movies to see your genre radar
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 280 280" className="w-full max-w-[280px]">
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={genres.map((_, i) => pointAt(i, R * level).join(',')).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        ))}

        {genres.map((_, i) => {
          const [x, y] = pointAt(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}

        <polygon
          points={dataPoints.map(p => p.join(',')).join(' ')}
          fill="rgba(239,68,68,0.15)"
          stroke="rgba(239,68,68,0.7)"
          strokeWidth="2"
        />

        {dataPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#ef4444" stroke="#1a1a2e" strokeWidth="2" />
        ))}

        {genres.map((g, i) => {
          const [x, y] = pointAt(i, R + 22);
          return (
            <text
              key={g}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-[10px]"
            >
              {g}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

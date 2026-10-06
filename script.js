// ===== 対象ウォッチリスト（東証プライム・日経225中心、約60銘柄）=====
// code: 証券コード, name: 銘柄名（概称）
const WATCHLIST = [
  { code: "7203", name: "トヨタ自動車" },
  { code: "7267", name: "ホンダ" },
  { code: "7201", name: "日産自動車" },
  { code: "7270", name: "SUBARU" },
  { code: "6902", name: "デンソー" },
  { code: "7974", name: "任天堂" },
  { code: "6758", name: "ソニーグループ" },
  { code: "6861", name: "キーエンス" },
  { code: "8035", name: "東京エレクトロン" },
  { code: "6857", name: "アドバンテスト" },
  { code: "6981", name: "村田製作所" },
  { code: "6762", name: "TDK" },
  { code: "6501", name: "日立製作所" },
  { code: "6752", name: "パナソニックHD" },
  { code: "6367", name: "ダイキン工業" },
  { code: "4063", name: "信越化学工業" },
  { code: "7741", name: "HOYA" },
  { code: "9983", name: "ファーストリテイリング" },
  { code: "9984", name: "ソフトバンクグループ" },
  { code: "8058", name: "三菱商事" },
  { code: "8031", name: "三井物産" },
  { code: "8001", name: "伊藤忠商事" },
  { code: "8053", name: "住友商事" },
  { code: "8002", name: "丸紅" },
  { code: "8306", name: "三菱UFJフィナンシャル・グループ" },
  { code: "8316", name: "三井住友フィナンシャルグループ" },
  { code: "8411", name: "みずほフィナンシャルグループ" },
  { code: "8766", name: "東京海上ホールディングス" },
  { code: "2914", name: "日本たばこ産業" },
  { code: "5020", name: "ENEOSホールディングス" },
  { code: "4502", name: "武田薬品工業" },
  { code: "4568", name: "第一三共" },
  { code: "4523", name: "エーザイ" },
  { code: "4503", name: "アステラス製薬" },
  { code: "4519", name: "中外製薬" },
  { code: "4507", name: "塩野義製薬" },
  { code: "9432", name: "日本電信電話(NTT)" },
  { code: "9433", name: "KDDI" },
  { code: "9434", name: "ソフトバンク" },
  { code: "9101", name: "日本郵船" },
  { code: "9104", name: "商船三井" },
  { code: "9107", name: "川崎汽船" },
  { code: "5411", name: "JFEホールディングス" },
  { code: "5401", name: "日本製鉄" },
  { code: "7011", name: "三菱重工業" },
  { code: "7012", name: "川崎重工業" },
  { code: "7013", name: "IHI" },
  { code: "9020", name: "JR東日本" },
  { code: "9022", name: "JR東海" },
  { code: "9202", name: "ANAホールディングス" },
  { code: "9201", name: "日本航空" },
  { code: "4661", name: "オリエンタルランド" },
  { code: "3382", name: "セブン&アイ・ホールディングス" },
  { code: "8267", name: "イオン" },
  { code: "9843", name: "ニトリホールディングス" },
  { code: "4452", name: "花王" },
  { code: "4911", name: "資生堂" },
  { code: "5108", name: "ブリヂストン" },
  { code: "3407", name: "旭化成" },
  { code: "4005", name: "住友化学" },
  { code: "4188", name: "三菱ケミカルグループ" },
  { code: "3402", name: "東レ" },
  { code: "8801", name: "三井不動産" },
  { code: "8802", name: "三菱地所" },
];

// ===== テーマ定義 =====
const THEMES = {
  gyakubari: {
    label: "逆張り（反発狙い）",
    desc: "前営業日に大きく下落した銘柄を「売られ過ぎからの反発」候補として抽出します。下落には業績悪化など明確な理由がある場合も多く、そのまま下げ止まらず続落するリスクもあります。必ず下落理由を自分で確認してください。",
    columns: ["順位", "銘柄", "コード", "現在値(目安)", "前日比", "出来高倍率", "備考"],
    score: (q) => q.prevDayChangePct != null ? -q.prevDayChangePct : -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), q.volumeRatio != null ? `${q.volumeRatio.toFixed(2)}倍` : "―", "前日下落率が大きい順"],
  },
  junbari: {
    label: "順張り（上昇継続狙い）",
    desc: "前営業日に大きく上昇した銘柄を「上昇トレンド継続」候補として抽出します。既に材料出尽くしで反落するケースもあるため、高値掴みに注意してください。",
    columns: ["順位", "銘柄", "コード", "現在値(目安)", "前日比", "出来高倍率", "備考"],
    score: (q) => q.prevDayChangePct ?? -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), q.volumeRatio != null ? `${q.volumeRatio.toFixed(2)}倍` : "―", "前日上昇率が大きい順"],
  },
  takane: {
    label: "値がさ株",
    desc: "1株あたりの株価が高い銘柄。値動き幅が大きく、わずかな値動きでも指数への影響・値幅が大きくなりやすい傾向があります。",
    columns: ["順位", "銘柄", "コード", "株価", "前日比", "出来高", "備考"],
    score: (q) => q.price ?? -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), num(q.volume), "株価の高さで順位付け"],
  },
  haito: {
    label: "高配当株",
    desc: "配当利回り(配当金÷現在株価)が高い銘柄。配当金額は概算の手動設定値のため目安としてご利用ください。株価は最新値で計算しています。利回りは株価変動で日々変わるほか、減配・無配のリスクもあります。",
    columns: ["順位", "銘柄", "コード", "株価", "前日比", "配当利回り(概算)", "備考"],
    score: (q) => q.dividendYield ?? -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), q.dividendYield != null ? pct(q.dividendYield) : "―", q.dividendYen != null ? `配当${q.dividendYen}円(概算)÷現在株価` : "配当データなし"],
  },
  dekidaka: {
    label: "出来高急増",
    desc: "直近の出来高が過去3か月平均に比べて急増している銘柄。材料・注目度の高まりを示す一方、値動きも荒くなりがちです。",
    columns: ["順位", "銘柄", "コード", "株価", "前日比", "出来高倍率", "備考"],
    score: (q) => q.volumeRatio ?? -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), q.volumeRatio != null ? `${q.volumeRatio.toFixed(2)}倍` : "―", "出来高÷3か月平均出来高で順位付け"],
  },
  shinkou: {
    label: "年初来高値圏",
    desc: "52週高値に対する現在株価の近さで順位付け。上昇トレンドが継続している銘柄を抽出しますが、高値掴みのリスクもあります。",
    columns: ["順位", "銘柄", "コード", "株価", "前日比", "52週高値比", "備考"],
    score: (q) => q.nearHighRatio ?? -Infinity,
    row: (q) => [yen(q.price), pctCell(q.prevDayChangePct), q.nearHighRatio != null ? pct(q.nearHighRatio) : "―", "株価÷52週高値で順位付け"],
  },
};

// ===== 高配当テーマ用：年間配当金（円/株、概算・手動設定値）=====
// Yahoo!Financeの配当利回りAPI(v10/quoteSummary)は認証エラーで取得できないため、
// 代表的な高配当銘柄のみ概算の年間配当金を手動設定し、現在株価から利回りを都度計算する。
// ※ここに記載の配当金額は過去の公表実績に基づく概算であり、最新・正確な値を保証するものではありません。
const DIVIDEND_YEN = {
  "8306": 56, "8316": 110, "8411": 60, "2914": 194, "5020": 22,
  "9432": 5.2, "9433": 145, "9434": 86, "5401": 160, "5411": 70,
  "9101": 140, "9104": 155, "9107": 170, "8058": 100, "8031": 90,
  "8001": 71, "8053": 62, "8002": 75, "8766": 124, "9201": 45,
  "9202": 30, "5108": 140, "3407": 34, "4452": 148, "4005": 9,
  "4188": 22, "3402": 20,
};

let currentTheme = "gyakubari";
let quoteCache = null; // { data: Map(code->quote), fetchedAt: Date, failedCodes: [] }

// ===== フォーマッタ =====
function yen(v) {
  if (v == null || !isFinite(v)) return "―";
  return `¥${Math.round(v).toLocaleString("ja-JP")}`;
}
function num(v) {
  if (v == null || !isFinite(v)) return "―";
  return Math.round(v).toLocaleString("ja-JP");
}
function pct(v) {
  if (v == null || !isFinite(v)) return "―";
  return `${(v * 100).toFixed(2)}%`;
}
function pctCell(v) {
  if (v == null || !isFinite(v)) return "―";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

// ===== データ取得 =====
// v7/finance/quote, v10/finance/quoteSummary は認証(crumb)が必須で401になるため使用しない。
// v8/finance/chart は認証不要で取得できることを確認済みなので、これを1銘柄ずつ叩く。
function buildChartUrl(code) {
  return `https://query1.finance.yahoo.com/v8/finance/chart/${code}.T?interval=1d&range=3mo`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithFallback(url) {
  // Yahoo側はブラウザ向けCORSヘッダーを返さないため、直接フェッチは基本的に失敗する前提で
  // プロキシ経由を優先的に試す。429(レート制限)時は少し待って次の手段へ。
  const attempts = [
    async () => {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
      return await res.json();
    },
    async () => {
      // r.jina.ai: テキストリーダープロキシ。JSON本体をテキストから抽出してパースする
      const res = await fetch(`https://r.jina.ai/${url}`);
      if (res.status === 429) throw Object.assign(new Error("レート制限(429)"), { retry: true });
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
      const text = await res.text();
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("レスポンス解析失敗");
      return JSON.parse(text.slice(start, end + 1));
    },
    async () => {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (res.status === 429) throw Object.assign(new Error("レート制限(429)"), { retry: true });
      if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
      return await res.json();
    },
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (e) {
      lastError = e;
      if (e.retry) await sleep(800);
    }
  }
  throw lastError ?? new Error("取得失敗");
}

async function fetchOneQuote(code) {
  const json = await fetchJsonWithFallback(buildChartUrl(code));
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("データなし");
  const meta = result.meta ?? {};
  const closesRaw = result.indicators?.quote?.[0]?.close ?? [];
  const volumesRaw = result.indicators?.quote?.[0]?.volume ?? [];

  // 「前日比」は取得タイミング(取引時間中かどうか)に左右されないよう、
  // meta.regularMarketChangePercent(当日ライブ値を含みうる)ではなく、
  // 直近2本の「確定済み終値」同士の騰落率を自前で計算する。
  const validCloseIdx = [];
  for (let i = closesRaw.length - 1; i >= 0 && validCloseIdx.length < 2; i--) {
    if (typeof closesRaw[i] === "number") validCloseIdx.push(i);
  }
  let prevDayChangePct = null;
  let lastValidClose = null;
  if (validCloseIdx.length === 2) {
    const [iLast, iPrev] = validCloseIdx;
    lastValidClose = closesRaw[iLast];
    const prevClose = closesRaw[iPrev];
    if (prevClose) prevDayChangePct = ((lastValidClose - prevClose) / prevClose) * 100;
  }

  const volumes = volumesRaw.filter((v) => typeof v === "number");
  const avgVol3m = volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : null;
  const lastValidVolume = validCloseIdx.length > 0 ? volumesRaw[validCloseIdx[0]] : null;

  const price = typeof meta.regularMarketPrice === "number" ? meta.regularMarketPrice : lastValidClose;
  const dividendYen = DIVIDEND_YEN[code] ?? null;

  return {
    code,
    price,
    prevDayChangePct,
    volume: typeof lastValidVolume === "number" ? lastValidVolume : null,
    volumeRatio: typeof lastValidVolume === "number" && avgVol3m ? lastValidVolume / avgVol3m : null,
    nearHighRatio: price != null && meta.fiftyTwoWeekHigh ? price / meta.fiftyTwoWeekHigh : null,
    dividendYen,
    dividendYield: price != null && dividendYen != null ? dividendYen / price : null,
  };
}

async function fetchAllQuotes() {
  const codes = WATCHLIST.map((w) => w.code);
  const concurrency = 5;
  const resultMap = new Map();
  const failedCodes = [];
  let done = 0;

  let cursor = 0;
  async function worker() {
    while (cursor < codes.length) {
      const code = codes[cursor++];
      try {
        const q = await fetchOneQuote(code);
        resultMap.set(code, q);
      } catch (e) {
        failedCodes.push(code);
      }
      done++;
      setLoadingDetail(`データ取得中... (${done}/${codes.length}銘柄)`);
      await sleep(150); // レート制限回避のための小休止
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  return { data: resultMap, fetchedAt: new Date(), failedCodes };
}

// ===== 表示 =====
function setLoadingDetail(text) {
  const el = document.getElementById("loadingDetail");
  if (el) el.textContent = text;
}

function showLoading(show) {
  document.getElementById("loadingBox").style.display = show ? "flex" : "none";
  document.getElementById("refreshBtn").disabled = show;
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  if (!msg) {
    box.style.display = "none";
    box.textContent = "";
    return;
  }
  box.style.display = "block";
  box.textContent = msg;
}

function renderTheme() {
  const theme = THEMES[currentTheme];
  document.getElementById("themeDesc").textContent = theme.desc;

  const headRow = document.getElementById("resultHead");
  headRow.innerHTML = theme.columns.map((c) => `<th>${c}</th>`).join("");

  const body = document.getElementById("resultBody");
  if (!quoteCache || quoteCache.data.size === 0) {
    body.innerHTML = `<tr><td colspan="${theme.columns.length}" style="text-align:center;color:var(--muted);padding:24px;">「最新データを取得」ボタンを押してください</td></tr>`;
    return;
  }

  const topN = Number(document.getElementById("topN").value);
  const list = WATCHLIST
    .map((w) => ({ ...w, q: quoteCache.data.get(w.code) }))
    .filter((item) => item.q)
    .sort((a, b) => theme.score(b.q) - theme.score(a.q))
    .slice(0, topN);

  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="${theme.columns.length}" style="text-align:center;color:var(--muted);padding:24px;">表示できるデータがありません（取得失敗の可能性があります）</td></tr>`;
    return;
  }

  body.innerHTML = list
    .map((item, idx) => {
      const cells = theme.row(item.q);
      const changeClass = item.q.prevDayChangePct > 0 ? "up" : item.q.prevDayChangePct < 0 ? "down" : "";
      return `<tr>
        <td><span class="rank-badge">${idx + 1}</span></td>
        <td>${item.name}</td>
        <td>${item.code}</td>
        <td>${cells[0]}</td>
        <td class="${changeClass}">${cells[1]}</td>
        <td>${cells[2]}</td>
        <td style="color:var(--muted);font-size:0.8rem;">${cells[3]}</td>
      </tr>`;
    })
    .join("");
}

function updateStatus() {
  const el = document.getElementById("statusText");
  if (!quoteCache) {
    el.textContent = "未取得";
    return;
  }
  const time = quoteCache.fetchedAt.toLocaleString("ja-JP");
  const failCount = quoteCache.failedCodes.length;
  el.textContent = `最終取得: ${time}（${quoteCache.data.size}/${WATCHLIST.length}銘柄取得${failCount > 0 ? `, ${failCount}銘柄失敗` : ""}）`;
}

async function doRefresh() {
  showError(null);
  showLoading(true);
  try {
    quoteCache = await fetchAllQuotes();
    if (quoteCache.data.size === 0) {
      showError(
        "データ取得に失敗しました。Yahoo! Finance側の仕様変更やアクセス制限、CORSプロキシの不調が原因の可能性があります。\n時間をおいて再試行するか、別のデータ取得方法の実装が必要になる場合があります。"
      );
    } else if (quoteCache.failedCodes.length > 0) {
      showError(`一部銘柄（${quoteCache.failedCodes.length}件）の取得に失敗しました。表示結果は取得できた銘柄のみに基づきます。`);
    }
  } catch (e) {
    showError(`データ取得エラー: ${e.message}`);
  } finally {
    showLoading(false);
    updateStatus();
    renderTheme();
  }
}

// ===== イベント =====
document.getElementById("themeTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  currentTheme = btn.dataset.theme;
  renderTheme();
});

document.getElementById("topN").addEventListener("change", renderTheme);
document.getElementById("refreshBtn").addEventListener("click", doRefresh);

// 初期表示
renderTheme();

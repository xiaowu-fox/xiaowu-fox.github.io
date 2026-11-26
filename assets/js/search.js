(function () {
  "use strict";

  var input = document.getElementById("search-input");
  var resultsEl = document.getElementById("search-results");
  var statusEl = document.getElementById("search-status");
  if (!input || !resultsEl) return;

  var allPosts = [];
  var loaded = false;

  /* 转义 HTML，防止内容里的标签被执行 */
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 关键词高亮（先转义再包裹 mark） */
  function highlight(text, kws) {
    var out = escapeHtml(text);
    kws.forEach(function (kw) {
      if (!kw) return;
      var pattern = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp("(" + pattern + ")", "gi"), "<mark>$1</mark>");
    });
    return out;
  }

  function scoreOf(item, kws) {
    var title = item.title.toLowerCase();
    var tags = (item.tags || []).join(" ").toLowerCase();
    var body = (item.excerpt + " " + item.content).toLowerCase();
    var score = 0;
    kws.forEach(function (kw) {
      if (title.indexOf(kw) !== -1) score += 10;
      if (tags.indexOf(kw) !== -1) score += 5;
      if (body.indexOf(kw) !== -1) score += 1;
    });
    return score;
  }

  function render(list, kws, rawQuery) {
    if (!rawQuery) {
      statusEl.textContent = "共 " + allPosts.length + " 篇文章，输入关键词开始搜索。";
      resultsEl.innerHTML = "";
      return;
    }
    if (list.length === 0) {
      statusEl.textContent = "";
      resultsEl.innerHTML = '<div class="search-empty">没有找到与「' + escapeHtml(rawQuery) + "」相关的文章，换个关键词试试。</div>";
      return;
    }
    statusEl.textContent = "找到 " + list.length + " 篇相关文章";
    resultsEl.innerHTML = list.map(function (item) {
      var tags = (item.tags || []).map(function (t) {
        return '<span class="tag-chip">' + highlight(t, kws) + "</span>";
      }).join("");
      var summary = item.excerpt || (item.content || "").slice(0, 140);
      return (
        '<a class="search-result" href="' + escapeHtml(item.url) + '">' +
          '<div class="search-result-head"><time class="search-result-date">' + escapeHtml(item.date) + "</time></div>" +
          '<h3 class="search-result-title">' + highlight(item.title, kws) + "</h3>" +
          '<p class="search-result-excerpt">' + highlight(summary, kws) + "</p>" +
          (tags ? '<div class="search-result-tags">' + tags + "</div>" : "") +
        "</a>"
      );
    }).join("");
  }

  function runSearch() {
    var raw = input.value.trim();
    if (!loaded) {
      statusEl.textContent = "索引加载中…";
      return;
    }
    var kws = raw.toLowerCase().split(/\s+/).filter(Boolean);
    if (!raw) {
      render([], kws, "");
      return;
    }
    var matched = allPosts.map(function (item) {
      var hay = (item.title + " " + (item.tags || []).join(" ") + " " +
        item.excerpt + " " + item.content).toLowerCase();
      var ok = kws.every(function (kw) { return hay.indexOf(kw) !== -1; });
      return ok ? { item: item, score: scoreOf(item, kws) } : null;
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; })
      .map(function (x) { return x.item; });

    render(matched, kws, raw);
  }

  var debounceTimer = null;
  input.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 120);
  });

  /* 加载搜索索引（相对路径解析到站点根目录的 search.json） */
  fetch("search.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      allPosts = Array.isArray(data) ? data : [];
      loaded = true;
      runSearch();
    })
    .catch(function () {
      loaded = true;
      statusEl.textContent = "搜索索引加载失败，请稍后刷新重试。";
    });
})();

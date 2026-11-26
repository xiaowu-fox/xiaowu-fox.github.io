(function () {
  "use strict";

  /* ===== 明暗主题切换 ===== */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncGiscus(next);
    });
  }

  /* ===== 评论区 Giscus 主题跟随 ===== */
  function syncGiscus(theme) {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme || currentTheme() } } },
      "https://giscus.app"
    );
  }
  window.addEventListener("message", function (event) {
    if (event.origin !== "https://giscus.app") return;
    if (event.data && event.data.giscus) syncGiscus();
  });

  /* ===== 阅读进度条 ===== */
  var progressBar = document.getElementById("progress-bar");

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  /* ===== 回到顶部 ===== */
  var backTop = document.getElementById("back-to-top");

  function toggleBackTop() {
    if (!backTop) return;
    backTop.classList.toggle("show", (window.scrollY || 0) > 420);
  }

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== 文章目录 TOC ===== */
  function buildToc() {
    var toc = document.getElementById("toc");
    var content = document.getElementById("post-content");
    if (!toc || !content) return;

    var headings = content.querySelectorAll("h2, h3");
    var tocWrap = document.querySelector(".toc-wrap");

    if (headings.length === 0) {
      if (tocWrap) tocWrap.style.display = "none";
      return;
    }

    var html = [];
    Array.prototype.forEach.call(headings, function (h, i) {
      if (!h.id) h.id = "heading-" + i;
      var level = h.tagName.toLowerCase() === "h3" ? 3 : 2;
      html.push(
        '<a class="toc-link toc-level-' + level + '" href="#' + h.id +
          '" data-target="' + h.id + '">' + h.textContent + "</a>"
      );
    });
    toc.innerHTML = html.join("");

    var links = Array.prototype.slice.call(toc.querySelectorAll(".toc-link"));

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(link.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    function highlight() {
      var pos = window.scrollY + 110;
      var activeId = null;
      Array.prototype.forEach.call(headings, function (h) {
        if (h.getBoundingClientRect().top + window.scrollY <= pos) activeId = h.id;
      });
      links.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("data-target") === activeId);
      });
    }

    window.addEventListener("scroll", highlight, { passive: true });
    highlight();
  }

  /* ===== 全局事件 ===== */
  window.addEventListener("scroll", function () {
    updateProgress();
    toggleBackTop();
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    buildToc();
    updateProgress();
    toggleBackTop();
    syncGiscus();
  });

  updateProgress();
  toggleBackTop();
})();

(() => {
  'use strict';
  const courses = window.OPENOPEN_COURSES || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const storageKey = 'openopen.progress.v1';
  const readProgress = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  };
  const writeProgress = (progress) => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); return true; }
    catch { return false; }
  };
  const progress = readProgress();

  function updateScrollEffects() {
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    const bar = $('#bar');
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    document.querySelectorAll('.bg i').forEach((blob, index) => {
      blob.style.transform = `translateY(${window.scrollY * (.07 + index * .035)}px)`;
    });
  }
  window.addEventListener('scroll', updateScrollEffects, { passive: true });
  updateScrollEffects();

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealNodes.forEach((node, index) => { node.style.transitionDelay = `${(index % 4) * 65}ms`; observer.observe(node); });
  } else revealNodes.forEach(node => node.classList.add('in'));

  // Home page
  const courseGrid = $('#course-grid');
  if (courseGrid) {
    const search = $('#course-search');
    const renderCards = (filter = '') => {
      const q = filter.trim().toLocaleLowerCase('vi');
      const filtered = courses.filter(course => `${course.name} ${course.tag} ${course.description}`.toLocaleLowerCase('vi').includes(q));
      courseGrid.innerHTML = filtered.length ? filtered.map(course => `
        <a class="course-card glass" href="courses/${course.id}.html" style="--accent:${course.color}" aria-label="Học ${escapeHTML(course.name)}">
          <div class="course-symbol">${escapeHTML(course.symbol)}</div>
          <h3>${escapeHTML(course.name)}</h3><p>${escapeHTML(course.description)}</p>
          <span class="level">${escapeHTML(course.level)}</span><span class="course-arrow" aria-hidden="true">↗</span>
        </a>`).join('') : '<div class="empty-state glass">Không tìm thấy ngôn ngữ phù hợp. Thử từ khóa khác nhé.</div>';
    };
    renderCards();
    if (search) search.addEventListener('input', event => renderCards(event.target.value));

    const demos = {
      Python: { code: '# In lời chào ba lần\nfor number in range(1, 4):\n    print("Xin chào", number)', output: 'Xin chào 1\nXin chào 2\nXin chào 3' },
      JavaScript: { code: '// Duyệt qua danh sách\nconst names = ["Ada", "Linus"];\nfor (const name of names) {\n  console.log("Hi " + name);\n}', output: 'Hi Ada\nHi Linus' },
      HTML: { code: '<main>\n  <h1>Chào mừng!</h1>\n  <p>Đây là trang đầu tiên.</p>\n</main>', output: 'Một tiêu đề lớn và một đoạn văn sẽ xuất hiện trên trang.' }
    };
    const code = $('#demo-code');
    const output = $('#demo-output');
    let activeDemo = 'Python';
    const showDemo = name => {
      if (!demos[name]) return;
      activeDemo = name;
      code.textContent = demos[name].code;
      output.textContent = 'Nhấn “Xem kết quả mẫu” để xem đầu ra dự kiến.';
      output.classList.remove('visible');
      document.querySelectorAll('[data-demo]').forEach(button => button.classList.toggle('active', button.dataset.demo === name));
    };
    document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => showDemo(button.dataset.demo)));
    $('#demo-run')?.addEventListener('click', () => {
      output.textContent = demos[activeDemo].output;
      output.classList.add('visible');
    });
    showDemo('Python');
  }

  // Individual course pages
  const courseId = document.body.dataset.course;
  if (courseId) {
    const course = courses.find(item => item.id === courseId);
    if (!course) {
      const target = $('#lesson-detail');
      if (target) target.textContent = 'Không tìm thấy nội dung khóa học.';
      return;
    }
    document.title = `${course.name} · Open Open by OpenDev`;
    $('#course-name').textContent = course.name;
    $('#course-tag').textContent = course.tag;
    $('#course-description').textContent = course.description;
    $('#course-level').textContent = course.level;
    $('#course-duration').textContent = course.duration;
    $('#course-goal').textContent = course.goal;
    $('#course-symbol').textContent = course.symbol;
    $('#course-symbol').style.color = course.color;
    $('#course-symbol').style.background = `color-mix(in srgb, ${course.color} 12%, white)`;

    const lessonNav = $('#lesson-nav');
    let currentLesson = 0;
    const completed = () => Array.isArray(progress[courseId]) ? progress[courseId] : [];
    const updateProgressUI = () => {
      const done = completed().length;
      const total = course.lessons.length;
      $('#progress-count').textContent = `${done}/${total}`;
      $('#progress-fill').style.width = `${(done / total) * 100}%`;
      lessonNav.querySelectorAll('.lesson-link').forEach((button, index) => {
        button.classList.toggle('done', completed().includes(index));
        const badge = $('.lesson-index', button);
        if (badge) badge.textContent = completed().includes(index) ? '✓' : String(index + 1);
      });
    };
    lessonNav.innerHTML = course.lessons.map((lesson, index) => `
      <button class="lesson-link${index === 0 ? ' active' : ''}" type="button" data-lesson="${index}">
        <span class="lesson-index">${index + 1}</span><span>${escapeHTML(lesson.title)}</span>
      </button>`).join('');

    function renderLesson(index) {
      currentLesson = Math.max(0, Math.min(index, course.lessons.length - 1));
      const lesson = course.lessons[currentLesson];
      $('#lesson-detail').innerHTML = `
        <div class="lesson-kicker">Chương ${currentLesson + 1} / ${course.lessons.length}</div>
        <h2>${escapeHTML(lesson.title)}</h2>
        <p class="lesson-intro">${escapeHTML(lesson.intro)}</p>
        <div class="lesson-copy">${lesson.body.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('')}</div>
        <div class="code-card">
          <div class="code-head"><span>Ví dụ · ${escapeHTML(course.name)}</span><button type="button" class="copy-btn" id="copy-code">Sao chép mã</button></div>
          <pre class="sample-code"><code id="lesson-code">${escapeHTML(lesson.code)}</code></pre>
        </div>
        <div class="output-card"><div class="output-label">Kết quả mẫu · không thực thi mã</div><pre>${escapeHTML(lesson.output)}</pre></div>
        <div class="exercise-card">
          <div class="exercise-top"><span class="exercise-icon" aria-hidden="true">✦</span><h3>Bài tập thực hành</h3></div>
          <p>${escapeHTML(lesson.task)}</p>
          <div class="hint-row"><button type="button" class="text-action" id="show-hint">Xem gợi ý</button><button type="button" class="text-action" id="show-solution">Xem lời giải tham khảo</button></div>
          <div class="hidden-note" id="hint-note">${escapeHTML(lesson.hint)}</div>
          <pre class="hidden-note" id="solution-note">${escapeHTML(lesson.solution)}</pre>
        </div>
        <div class="lesson-actions">
          <button type="button" class="complete-btn${completed().includes(currentLesson) ? ' done' : ''}" id="complete-lesson">${completed().includes(currentLesson) ? '✓ Đã hoàn thành' : '○ Đánh dấu đã học'}</button>
          <button type="button" class="btn next-btn" id="next-lesson">${currentLesson === course.lessons.length - 1 ? 'Xem lại chương đầu' : 'Bài tiếp theo'} <span aria-hidden="true">→</span></button>
        </div>`;
      lessonNav.querySelectorAll('.lesson-link').forEach(button => button.classList.toggle('active', Number(button.dataset.lesson) === currentLesson));
      $('#copy-code').addEventListener('click', async event => {
        const button = event.currentTarget;
        try {
          await navigator.clipboard.writeText(lesson.code);
          button.textContent = 'Đã sao chép ✓';
        } catch {
          button.textContent = 'Không sao chép được';
        }
        window.setTimeout(() => { button.textContent = 'Sao chép mã'; }, 1800);
      });
      $('#show-hint').addEventListener('click', () => $('#hint-note').classList.toggle('show'));
      $('#show-solution').addEventListener('click', () => $('#solution-note').classList.toggle('show'));
      $('#complete-lesson').addEventListener('click', () => {
        const list = completed();
        const found = list.includes(currentLesson);
        progress[courseId] = found ? list.filter(item => item !== currentLesson) : [...list, currentLesson].sort((a,b) => a-b);
        writeProgress(progress);
        renderLesson(currentLesson);
        updateProgressUI();
      });
      $('#next-lesson').addEventListener('click', () => {
        renderLesson((currentLesson + 1) % course.lessons.length);
        updateProgressUI();
        $('#lesson-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      updateProgressUI();
    }
    lessonNav.querySelectorAll('.lesson-link').forEach(button => button.addEventListener('click', () => {
      renderLesson(Number(button.dataset.lesson));
      updateProgressUI();
      if (window.matchMedia('(max-width: 760px)').matches) $('#lesson-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    renderLesson(0);
    updateProgressUI();
  }
})();

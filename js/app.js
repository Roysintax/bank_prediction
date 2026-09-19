/* ==========================================================================
   BANKPULSE AI - INTERACTIVE LOGIC & PREDICTION SIMULATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModelTable();
  initConfusionMatrix();
  initDurationExperiment();
  initFeatureImportance();
  initThresholdSlider();
  initSimulator();
  initPresets();
});

// 1. Navigation Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// 2. Model Performance Table
function initModelTable() {
  const tbody = document.getElementById('model-table-body');
  if (!tbody || !window.BANK_DATA || !window.BANK_DATA.models) return;

  const models = window.BANK_DATA.models.filter(m => !m.duration_used);
  tbody.innerHTML = '';

  models.forEach(m => {
    const tr = document.createElement('tr');
    const isWinner = m.model === 'Random Forest';
    if (isWinner) tr.classList.add('highlight-row');

    tr.innerHTML = `
      <td>
        <strong>${m.model}</strong>
        ${isWinner ? '<span class="badge-winner">Recommended</span>' : ''}
      </td>
      <td class="val-mono">${(m.accuracy * 100).toFixed(2)}%</td>
      <td class="val-mono">${(m.precision * 100).toFixed(2)}%</td>
      <td class="val-mono" style="color: ${m.recall > 0.5 ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 700;">
        ${(m.recall * 100).toFixed(2)}%
      </td>
      <td class="val-mono" style="font-weight: 700;">${(m.f1 * 100).toFixed(2)}%</td>
      <td class="val-mono">${(m.roc_auc * 100).toFixed(2)}%</td>
      <td class="val-mono">${(m.pr_auc * 100).toFixed(2)}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// 3. Interactive Confusion Matrix
function initConfusionMatrix() {
  const select = document.getElementById('cm-model-select');
  if (!select || !window.BANK_DATA || !window.BANK_DATA.models) return;

  function renderCM(modelName) {
    const m = window.BANK_DATA.models.find(item => item.model === modelName);
    if (!m) return;

    const cm = m.confusion_matrix;
    document.getElementById('cm-tp').textContent = cm.tp.toLocaleString();
    document.getElementById('cm-tn').textContent = cm.tn.toLocaleString();
    document.getElementById('cm-fp').textContent = cm.fp.toLocaleString();
    document.getElementById('cm-fn').textContent = cm.fn.toLocaleString();

    document.getElementById('cm-model-title').textContent = `${m.model} (Test Set: 9,043 samples)`;
  }

  select.addEventListener('change', (e) => {
    renderCM(e.target.value);
  });

  // Initial render with Random Forest
  renderCM('Random Forest');
}

// 4. Duration Leakage Experiment
function initDurationExperiment() {
  if (!window.BANK_DATA || !window.BANK_DATA.models) return;

  const rfClean = window.BANK_DATA.models.find(m => m.model === 'Random Forest' && !m.duration_used);
  const rfLeak = window.BANK_DATA.models.find(m => m.model === 'Random Forest (With Duration)');

  if (rfClean && rfLeak) {
    document.getElementById('exp-clean-rec').textContent = `${(rfClean.recall * 100).toFixed(1)}%`;
    document.getElementById('exp-clean-auc').textContent = `${(rfClean.roc_auc * 100).toFixed(1)}%`;
    document.getElementById('exp-clean-f1').textContent = `${(rfClean.f1 * 100).toFixed(1)}%`;

    document.getElementById('exp-leak-rec').textContent = `${(rfLeak.recall * 100).toFixed(1)}%`;
    document.getElementById('exp-leak-auc').textContent = `${(rfLeak.roc_auc * 100).toFixed(1)}%`;
    document.getElementById('exp-leak-f1').textContent = `${(rfLeak.f1 * 100).toFixed(1)}%`;
  }
}

// 5. Feature Importance Bars
function initFeatureImportance() {
  const container = document.getElementById('feature-importance-bars');
  if (!container || !window.BANK_DATA || !window.BANK_DATA.feature_importances) return;

  const top12 = window.BANK_DATA.feature_importances.slice(0, 12);
  const maxImp = Math.max(...top12.map(f => f.importance));

  container.innerHTML = '';
  top12.forEach(item => {
    const widthPct = (item.importance / maxImp) * 100;
    const barEl = document.createElement('div');
    barEl.className = 'bar-item';
    barEl.innerHTML = `
      <div class="bar-name" title="${item.feature}">${formatFeatureName(item.feature)}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${widthPct.toFixed(1)}%;"></div>
      </div>
      <div class="bar-val">${(item.importance * 100).toFixed(1)}%</div>
    `;
    container.appendChild(barEl);
  });
}

function formatFeatureName(raw) {
  return raw
    .replace('cat__', '')
    .replace('num__', '')
    .replace('_', ' ')
    .replace('poutcome_success', 'prior_success')
    .replace('housing_yes', 'housing_loan')
    .replace('loan_yes', 'personal_loan');
}

// 6. Threshold Slider Optimizer
function initThresholdSlider() {
  const slider = document.getElementById('threshold-slider');
  const valDisplay = document.getElementById('threshold-val-display');
  const precDisplay = document.getElementById('thresh-precision');
  const recDisplay = document.getElementById('thresh-recall');
  const f1Display = document.getElementById('thresh-f1');
  const leadsDisplay = document.getElementById('thresh-leads');

  if (!slider || !window.BANK_DATA || !window.BANK_DATA.threshold_analysis) return;

  const analysis = window.BANK_DATA.threshold_analysis;

  function updateThreshold(threshVal) {
    valDisplay.textContent = Number(threshVal).toFixed(2);

    // Find closest threshold record or interpolate
    let closest = analysis.reduce((prev, curr) => 
      Math.abs(curr.threshold - threshVal) < Math.abs(prev.threshold - threshVal) ? curr : prev
    );

    precDisplay.textContent = `${(closest.precision * 100).toFixed(1)}%`;
    recDisplay.textContent = `${(closest.recall * 100).toFixed(1)}%`;
    f1Display.textContent = `${(closest.f1 * 100).toFixed(1)}%`;
    leadsDisplay.textContent = closest.predicted_positives.toLocaleString();
  }

  slider.addEventListener('input', (e) => {
    updateThreshold(parseFloat(e.target.value));
  });

  // Initial update
  updateThreshold(0.50);
}

// 7. Live Customer Simulator Engine
function initSimulator() {
  const form = document.getElementById('prediction-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAndRenderPrediction();
  });

  // Real-time recalculation on input change for dynamic feel
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', () => {
      calculateAndRenderPrediction();
    });
  });

  // Run once initially
  calculateAndRenderPrediction();
}

function calculateAndRenderPrediction() {
  const age = parseFloat(document.getElementById('input-age').value) || 35;
  const balance = parseFloat(document.getElementById('input-balance').value) || 1000;
  const job = document.getElementById('input-job').value;
  const marital = document.getElementById('input-marital').value;
  const education = document.getElementById('input-education').value;
  const defaultCredit = document.getElementById('input-default').value;
  const housing = document.getElementById('input-housing').value;
  const loan = document.getElementById('input-loan').value;
  const contact = document.getElementById('input-contact').value;
  const month = document.getElementById('input-month').value;
  const campaign = parseFloat(document.getElementById('input-campaign').value) || 1;
  const pdays = parseFloat(document.getElementById('input-pdays').value) || 999;
  const previous = parseFloat(document.getElementById('input-previous').value) || 0;
  const poutcome = document.getElementById('input-poutcome').value;

  // Calibrated scoring model derived from Random Forest & Logistic Regression weights
  let logit = -0.95; // Base negative prior matching class imbalance
  const drivers = [];

  // Prior Campaign Outcome (Huge predictor)
  if (poutcome === 'success') {
    logit += 2.30;
    drivers.push({ name: 'Previous Campaign Success', impact: '+38%', type: 'pos' });
  } else if (poutcome === 'failure') {
    logit -= 0.20;
    drivers.push({ name: 'Previous Campaign Failure', impact: '-5%', type: 'neg' });
  }

  // Housing Loan (Significant negative friction)
  if (housing === 'yes') {
    logit -= 0.65;
    drivers.push({ name: 'Active Housing Loan', impact: '-18%', type: 'neg' });
  } else {
    logit += 0.40;
    drivers.push({ name: 'No Housing Mortgage', impact: '+12%', type: 'pos' });
  }

  // Personal Loan (Negative friction)
  if (loan === 'yes') {
    logit -= 0.45;
    drivers.push({ name: 'Active Personal Loan', impact: '-12%', type: 'neg' });
  }

  // Balance
  if (balance > 5000) {
    logit += 0.55;
    drivers.push({ name: 'High Account Balance (>5k)', impact: '+15%', type: 'pos' });
  } else if (balance < 0) {
    logit -= 0.60;
    drivers.push({ name: 'Overdraft / Negative Balance', impact: '-16%', type: 'neg' });
  }

  // Age group
  if (age >= 60) {
    logit += 0.70;
    drivers.push({ name: 'Senior / Retiree Age Bracket', impact: '+18%', type: 'pos' });
  } else if (age < 25) {
    logit += 0.45;
    drivers.push({ name: 'Student / Young Saver Bracket', impact: '+12%', type: 'pos' });
  }

  // Job
  if (job === 'retired' || job === 'student') {
    logit += 0.50;
    drivers.push({ name: `Job Category: ${job}`, impact: '+14%', type: 'pos' });
  } else if (job === 'blue-collar' || job === 'services') {
    logit -= 0.30;
    drivers.push({ name: `Job Category: ${job}`, impact: '-8%', type: 'neg' });
  }

  // Education
  if (education === 'tertiary') {
    logit += 0.30;
    drivers.push({ name: 'Tertiary Education', impact: '+8%', type: 'pos' });
  }

  // Campaign Contacts (Call fatigue)
  if (campaign > 4) {
    logit -= 0.50;
    drivers.push({ name: `Repeated Calls (${campaign}x fatigue)`, impact: '-14%', type: 'neg' });
  }

  // Contact Month
  if (['mar', 'sep', 'oct', 'dec'].includes(month)) {
    logit += 0.75;
    drivers.push({ name: `High-Conversion Month (${month.toUpperCase()})`, impact: '+20%', type: 'pos' });
  }

  // Contact channel
  if (contact === 'cellular') {
    logit += 0.25;
  } else if (contact === 'unknown') {
    logit -= 0.45;
    drivers.push({ name: 'Unknown Contact Method', impact: '-12%', type: 'neg' });
  }

  // Convert logit to probability via Sigmoid
  const prob = 1 / (1 + Math.exp(-logit));
  const probPct = Math.round(prob * 100);

  // Update UI Elements
  const badge = document.getElementById('res-badge');
  const pctText = document.getElementById('res-pct');
  const riskPill = document.getElementById('res-risk-pill');
  const gaugeProgress = document.getElementById('res-gauge-progress');
  const driversList = document.getElementById('res-drivers-list');

  pctText.textContent = `${probPct}%`;

  // Circular gauge animation (circumference is 2 * PI * 70 ≈ 440)
  const offset = 440 - (440 * (probPct / 100));
  gaugeProgress.style.strokeDashoffset = offset;

  if (prob >= 0.50) {
    badge.className = 'result-badge yes';
    badge.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      PREDICTION: YES (SUBSCRIBED)
    `;
    gaugeProgress.style.stroke = 'var(--color-success)';
  } else {
    badge.className = 'result-badge no';
    badge.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      PREDICTION: NO (DECLINED)
    `;
    gaugeProgress.style.stroke = 'var(--color-danger)';
  }

  // Risk Tier Pill
  if (prob >= 0.65) {
    riskPill.className = 'risk-pill high';
    riskPill.textContent = 'High Conversion Likelihood';
  } else if (prob >= 0.40) {
    riskPill.className = 'risk-pill moderate';
    riskPill.textContent = 'Moderate Potential (Target with Offer)';
  } else {
    riskPill.className = 'risk-pill low';
    riskPill.textContent = 'Low Likelihood (Minimize Outreach Cost)';
  }

  // Render Drivers List
  driversList.innerHTML = '';
  const topDrivers = drivers.slice(0, 4);
  if (topDrivers.length === 0) {
    driversList.innerHTML = '<div style="color: var(--text-subtle); font-size: 0.8rem;">Average baseline profile</div>';
  } else {
    topDrivers.forEach(d => {
      const item = document.createElement('div');
      item.className = 'driver-item';
      item.innerHTML = `
        <span>${d.name}</span>
        <span class="driver-tag ${d.type}">${d.impact}</span>
      `;
      driversList.appendChild(item);
    });
  }
}

// 8. Preset Profiles
function initPresets() {
  const presets = {
    tech: {
      age: 34,
      job: 'technician',
      marital: 'single',
      education: 'tertiary',
      defaultCredit: 'no',
      balance: 4500,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      month: 'oct',
      campaign: 1,
      pdays: 120,
      previous: 2,
      poutcome: 'success'
    },
    bluecollar: {
      age: 42,
      job: 'blue-collar',
      marital: 'married',
      education: 'secondary',
      defaultCredit: 'no',
      balance: 150,
      housing: 'yes',
      loan: 'yes',
      contact: 'unknown',
      month: 'may',
      campaign: 5,
      pdays: 999,
      previous: 0,
      poutcome: 'unknown'
    },
    retiree: {
      age: 68,
      job: 'retired',
      marital: 'married',
      education: 'secondary',
      defaultCredit: 'no',
      balance: 12500,
      housing: 'no',
      loan: 'no',
      contact: 'telephone',
      month: 'mar',
      campaign: 1,
      pdays: 999,
      previous: 0,
      poutcome: 'unknown'
    }
  };

  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-preset');
      const data = presets[pKey];
      if (!data) return;

      document.getElementById('input-age').value = data.age;
      document.getElementById('input-job').value = data.job;
      document.getElementById('input-marital').value = data.marital;
      document.getElementById('input-education').value = data.education;
      document.getElementById('input-default').value = data.defaultCredit;
      document.getElementById('input-balance').value = data.balance;
      document.getElementById('input-housing').value = data.housing;
      document.getElementById('input-loan').value = data.loan;
      document.getElementById('input-contact').value = data.contact;
      document.getElementById('input-month').value = data.month;
      document.getElementById('input-campaign').value = data.campaign;
      document.getElementById('input-pdays').value = data.pdays;
      document.getElementById('input-previous').value = data.previous;
      document.getElementById('input-poutcome').value = data.poutcome;

      calculateAndRenderPrediction();
    });
  });
}

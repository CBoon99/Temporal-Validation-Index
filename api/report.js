const { createClient } = require('@supabase/supabase-js');
const { chromium } = require('playwright');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Missing token parameter' });
    }

    // Validate signed token
    const { data: tokenData, error: tokenError } = await supabase
      .from('pdf_tokens')
      .select('calculation_id, user_id, expires_at, used')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    if (tokenData.used) {
      return res.status(403).json({ error: 'Token already used' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(403).json({ error: 'Token expired' });
    }

    // Mark token as used
    await supabase
      .from('pdf_tokens')
      .update({ used: true })
      .eq('token', token);

    // Fetch calculation data
    const { data: calc, error } = await supabase
      .from('calculations')
      .select('*')
      .eq('id', tokenData.calculation_id)
      .eq('user_id', tokenData.user_id)
      .single();

    if (error || !calc) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    // Log download
    await supabase.from('downloads').insert({
      user_id: calc.user_id,
      report_name: `${calc.domain}-report`,
      domain: calc.domain,
      calculation_id: tokenData.calculation_id
    });

    // Generate PDF using Playwright
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const html = generateReportHTML(calc);
    await page.setContent(html, { waitUntil: 'networkidle' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="TVI-Report-${tokenData.calculation_id}.pdf"`);
    res.send(pdf);

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
};

function generateReportHTML(calc) {
  const { domain, inputs, outputs, created_at } = calc;
  const { score, classification, components } = outputs;
  const name = inputs.name || inputs.title || inputs.company || 'Untitled';
  
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800&family=Inter:wght@400;600&family=Space+Mono:wght@700&display=swap');
body{font-family:'Inter',sans-serif;color:#111;background:#fff;margin:0;padding:40px;line-height:1.6}
.header{border-bottom:3px solid #2ce0ff;padding-bottom:20px;margin-bottom:30px}
.header h1{font-family:'Inter Tight';font-weight:800;font-size:32px;margin:0 0 8px 0;letter-spacing:-0.02em}
.header .meta{color:#666;font-size:13px}
.score-box{background:linear-gradient(135deg,rgba(44,224,255,0.1),rgba(44,224,255,0.05));border:2px solid #2ce0ff;border-radius:12px;padding:30px;text-align:center;margin:30px 0}
.score-value{font-family:'Space Mono';font-size:72px;font-weight:700;color:#000;line-height:1}
.score-label{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:8px}
.classification{display:inline-block;background:#2ce0ff;color:#000;padding:8px 16px;border-radius:999px;font-weight:700;font-size:15px;margin-top:16px}
.components{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin:30px 0}
.component{border:1px solid #ddd;border-radius:8px;padding:16px;text-align:center}
.component .val{font-family:'Space Mono';font-size:28px;font-weight:700;color:#2ce0ff}
.component .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px}
.section{margin:30px 0}
.section h2{font-family:'Inter Tight';font-size:20px;font-weight:700;margin-bottom:12px}
.footer{margin-top:50px;padding-top:20px;border-top:1px solid #ddd;text-align:center;color:#999;font-size:12px}
</style></head><body>
<div class="header">
<h1>TVI Report: ${name}</h1>
<div class="meta">Generated ${new Date(created_at).toLocaleDateString()} • Domain: ${domain.toUpperCase()} • Type: ${outputs.type}</div>
</div>
<div class="score-box">
<div class="score-label">${outputs.type} Score</div>
<div class="score-value">${score.toFixed(1)}</div>
<div class="classification">${classification}</div>
</div>
<div class="section">
<h2>Component Breakdown</h2>
<div class="components">
${components.map(c => `<div class="component"><div class="val">${c.v}</div><div class="lbl">${c.l}</div></div>`).join('')}
</div>
</div>
<div class="section">
<h2>Analysis</h2>
<p>${getAnalysis(domain, classification, score)}</p>
</div>
<div class="section">
<h2>Methodology</h2>
<p><strong>Formula:</strong> TVI = Saturation × log₁₀(Validation + 1) × Resistance</p>
<p>This score combines contextual saturation (CSI), temporal validation (TVS), and structural resistance (SRC) to measure staying power independent of hype cycles.</p>
</div>
<div class="footer">
<strong>BoonMind TVI Platform</strong> • Temporal Validation Index<br>
This report is confidential and intended for the recipient only.
</div>
</body></html>`;
}

function getAnalysis(domain, classification, score) {
  const analyses = {
    viral: `This content achieved ${classification} status with a TVI of ${score.toFixed(1)}. ${score > 50 ? 'Exceptionally high temporal validation indicates lasting cultural significance.' : score > 15 ? 'Strong temporal validation suggests enduring relevance.' : 'Limited temporal validation indicates ephemeral impact.'}`,
    datasets: `This dataset scored ${score.toFixed(1)} (${classification}). ${score > 1000 ? 'Foundation-tier datasets demonstrate decades of sustained adoption and cross-framework universality.' : score > 100 ? 'Validated datasets show proven staying power across research cycles.' : 'Recent or niche datasets require further temporal validation.'}`,
    business: `This methodology achieved ${classification} with TVI-B ${score.toFixed(1)}. ${score > 50 ? 'Foundation methodologies compound value over decades and become management infrastructure.' : score > 15 ? 'Validated frameworks show proven adoption across industries.' : 'Recent methodologies lack sufficient temporal proof.'}`,
    invest: `This investment scored ${score.toFixed(1)} (${classification}). ${score > 10000 ? 'Foundation companies demonstrate exceptional crisis survival and category dominance.' : score > 1000 ? 'Validated positions show structural competitive advantage.' : 'Trend-riding or ephemeral positions lack temporal proof.'}`
  };
  return analyses[domain] || `TVI score: ${score.toFixed(1)} (${classification})`;
}

/* cursor-verified: Book content single source of truth
 * Source: Time as Proof V3 Final (1).txt
 * Last updated: Jan 15, 2026
 * 
 * To update: Edit this file or regenerate from manuscript
 * Format: Each object = one "page" (can be section/chapter)
 */

const BOOK_CONTENT = [
  // Cover
  {
    id: 'cover',
    type: 'cover',
    title: 'TIME AS PROOF',
    subtitle: 'The Mathematics of What Lasts',
    author: 'Carl Boon',
    series: 'BoonMindX Series'
  },
  
  // Chapter 0
  {
    id: 'ch0-1',
    chapter: 0,
    title: 'THE TEMPORAL VALIDATION MANIFESTO',
    content: `<h2>I FELT IT BEFORE I COULD NAME IT</h2>
    <p>The internet remembers everything—except what actually mattered.</p>
    <p>I was staring at two numbers: 50 million views on a TikTok from last month—already forgotten. 1 million views on a YouTube video from 2007—still referenced daily.</p>
    <p>The metrics said the TikTok won. My gut screamed they were lying.</p>
    <p>That dissonance became an obsession. That obsession became a formula. The formula changed how I measure everything.</p>`
  },
  
  {
    id: 'ch0-2',
    chapter: 0,
    content: `<h3>THE BLIND SPOT</h3>
    <p>We've built a civilization that can measure everything except what survives.</p>
    <p>Every industry is optimizing for the wrong thing:</p>
    <ul>
      <li>Media: Chasing clicks instead of culture</li>
      <li>Business: Rewarding speed instead of stability</li>
      <li>Finance: Valuing hype instead of durability</li>
      <li>Technology: Building features instead of foundations</li>
    </ul>
    <p>The cost? Likely hundreds of billions in misallocated capital over time. Countless careers built on skills that won't last. An entire generation trained to measure noise instead of signal.</p>
    <p><strong>Virality is what happens when noise outruns memory.</strong></p>`
  },
  
  {
    id: 'ch0-3',
    chapter: 0,
    content: `<h3>TIME AUDITS EVERYTHING</h3>
    <p>Here's the brutal truth nobody wants to say:</p>
    <p><strong>If something only matters today and leaves no residue, time will erase it.</strong></p>
    <p>Time doesn't care what went viral. Time only cares what stayed. History is a graveyard of things that once had incredible engagement.</p>
    <p>Once you see the pattern, it appears everywhere:</p>
    <ul>
      <li>Viral content: Charlie Bit My Finger (2007) vs. a 2024 TikTok</li>
      <li>Business methods: SMART Goals (1981) vs. Holacracy (2015)</li>
      <li>AI datasets: MNIST (1998) vs. LAION-5B (2022)</li>
      <li>Companies: Apple (1976) vs. WeWork (collapsed under real stress)</li>
    </ul>
    <p>The same math worked every time. The same truth emerged:</p>
    <p><em>Scale without persistence is just expensive disappearing.</em></p>`
  },
  
  {
    id: 'ch0-4',
    chapter: 0,
    content: `<h3>THE FORMULA THAT PREDICTS WHAT LASTS</h3>
    <p>This is not a growth equation. It's a survival equation:</p>
    <div class="formula">TVI = Saturation × log₁₀(TVS + 1) × SRC</div>
    <p><strong>Where:</strong></p>
    <ul>
      <li><strong>Saturation:</strong> How unavoidable was this in its moment?</li>
      <li><strong>TVS (Temporal Validation Score):</strong> Has time proven it matters?</li>
      <li><strong>SRC (Structural Resistance Coefficient):</strong> How hard was achievement then vs. now?</li>
    </ul>
    <p>TVI doesn't measure how far something travels.</p>
    <p>It measures how long it refuses to die.</p>`
  },
  
  {
    id: 'ch0-5',
    chapter: 0,
    content: `<p>This framework explains:</p>
    <ul>
      <li>Why 2007 YouTube feels heavier than 2024 TikTok</li>
      <li>Why Peloton collapsed at the first real stress-test</li>
      <li>Why MNIST remains foundational while newer datasets decay</li>
    </ul>
    <p><strong>The math doesn't lie. Time doesn't lie.</strong></p>
    
    <h3>WHAT THIS BOOK ISN'T</h3>
    <p>This isn't:</p>
    <ul>
      <li>A business book (though it will save you money and mistakes)</li>
      <li>A self-help book (though it will clarify your choices)</li>
      <li>An academic textbook (though the logic is rigorous)</li>
    </ul>
    <p><strong>This is a builder's manual for what lasts.</strong></p>`
  },
  
  {
    id: 'ch0-6',
    chapter: 0,
    content: `<h3>WHAT YOU'LL BE ABLE TO DO</h3>
    <p>By the end of this book, you'll be able to estimate:</p>
    <ul>
      <li>Which content will still be referenced in 2034 (not just trending today)</li>
      <li>Which business methodologies will survive the next cycle</li>
      <li>Which AI training data will remain usable without constant retraining</li>
      <li>Which companies have Apple-like durability versus WeWork-like fragility</li>
    </ul>
    <p><strong>And for your own life:</strong></p>
    <ul>
      <li>Which skills have 10-year vs. 2-year half-lives</li>
      <li>Which relationships survive distance and time</li>
      <li>What knowledge compounds versus what expires</li>
      <li>How to build something that outlives you</li>
    </ul>`
  },
  
  {
    id: 'ch0-7',
    chapter: 0,
    content: `<h3>THE TEMPORAL RESISTANCE</h3>
    <p><strong>They have the metrics.<br>
    We have the meaning.</strong></p>
    <p><strong>They have the quarter.<br>
    We have the century.</strong></p>
    <p>This isn't just a book. It's a weapon against short-term thinking. A tool for building what matters. A lens that sees through hype.</p>
    <p>This book is about building things time can't erase.</p>
    <p>The rest is detail.</p>`
  },
  
  // Preview Lock - Page 8
  {
    id: 'preview-lock',
    type: 'lock',
    content: `<div class="lock-screen">
      <h2>Preview Ends Here</h2>
      <p>You've read the manifesto. Want the complete framework?</p>
      <div class="lock-options">
        <a href="#lottery-section" class="btn-primary">Enter Lottery (FREE)</a>
        <a href="#founding-section" class="btn-secondary">Buy Founding Edition ($19.95)</a>
      </div>
      <p class="lock-note">First 10 readers get FREE advance copies. First 100 get numbered founding editions.</p>
    </div>`
  }
  
  // Full book continues after purchase...
  // For now, preview = first 7 pages + lock screen
];

// Export for use in flipbook.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BOOK_CONTENT;
}


// Initialize Lucide icons
lucide.createIcons();

// Sparkline Canvas
function drawSparkline() {
	const canvas = document.getElementById('sparkline');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();

	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	ctx.scale(dpr, dpr);

	// Weight data over 30 days (simulated slight downtrend)
	const data = [75.8, 75.6, 75.9, 75.5, 75.3, 75.4, 75.1, 75.0, 74.8, 75.1,
		75.0, 74.7, 74.9, 74.6, 74.8, 74.5, 74.7, 74.4, 74.6, 74.3,
		74.5, 74.2, 74.4, 74.1, 74.3, 74.0, 74.2, 74.1, 74.3, 74.2
	];

	const min = Math.min(...data) - 0.3;
	const max = Math.max(...data) + 0.3;
	const w = rect.width;
	const h = rect.height;
	const padding = 2;

	const points = data.map((v, i) => ({
		x: padding + (i / (data.length - 1)) * (w - padding * 2),
		y: padding + ((max - v) / (max - min)) * (h - padding * 2)
	}));

	// Gradient fill
	const gradient = ctx.createLinearGradient(0, 0, 0, h);
	gradient.addColorStop(0, 'rgba(200, 255, 0, 0.15)');
	gradient.addColorStop(1, 'rgba(200, 255, 0, 0)');

	// Fill area
	ctx.beginPath();
	ctx.moveTo(points[0].x, h);
	points.forEach(p => ctx.lineTo(p.x, p.y));
	ctx.lineTo(points[points.length - 1].x, h);
	ctx.closePath();
	ctx.fillStyle = gradient;
	ctx.fill();

	// Line
	ctx.beginPath();
	points.forEach((p, i) => {
		if (i === 0) ctx.moveTo(p.x, p.y);
		else ctx.lineTo(p.x, p.y);
	});
	ctx.strokeStyle = '#C8FF00';
	ctx.lineWidth = 1.5;
	ctx.lineJoin = 'round';
	ctx.stroke();

	// End dot
	const last = points[points.length - 1];
	ctx.beginPath();
	ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
	ctx.fillStyle = '#C8FF00';
	ctx.fill();
}

drawSparkline();
window.addEventListener('resize', drawSparkline);

// Hydration add button
let waterCount = 5;
const addBtn = document.getElementById('addWater');

if (addBtn) {
	addBtn.addEventListener('click', () => {
		if (waterCount >= 8) return;
		waterCount++;

		const glasses = document.querySelectorAll('.hydration-glass');
		glasses.forEach((g, i) => {
			if (i < waterCount) {
				g.classList.add('hydration-glass--filled');
			}
		});

		// Update bar
		const barFill = document.querySelector('.hydration-bar__fill');
		if (barFill) {
			barFill.style.width = ((waterCount / 8) * 100) + '%';
		}

		// Update text
		const valueEl = document.querySelector('.hydration-card__value');
		if (valueEl) {
			valueEl.innerHTML = `${waterCount} <small>/ 8 glasses</small>`;
		}

		const liters = (waterCount * 0.25).toFixed(2);
		const subEl = document.querySelector('.hydration-card__sublabel');
		if (subEl) {
			subEl.textContent = `${liters}L OF 2.0L TARGET`;
		}

		// Re-init icons for new filled states
		lucide.createIcons();
	});
}

// Bottom nav interaction
document.querySelectorAll('.bottom-nav__item').forEach(item => {
	item.addEventListener('click', () => {
		document.querySelectorAll('.bottom-nav__item').forEach(i => i.classList.remove('bottom-nav__item--active'));
		item.classList.add('bottom-nav__item--active');
	});
});
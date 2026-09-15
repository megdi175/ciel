document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('tempChart').getContext('2d');

    // Dégradé sous la courbe du graphique
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h', 'Maintenant'],
            datasets: [{
                label: 'Température (°C)',
                data: [16.5, 15.8, 16.2, 19.5, 23.0, 25.4, 23.8, 20.1, 22.5],
                borderColor: '#3b82f6',
                borderWidth: 3,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1d4ed8',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    suggestedMin: 10,
                    suggestedMax: 30,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: (value) => value + ' °C'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
});
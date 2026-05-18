import { ArcElement, BarElement, CategoryScale, Chart as ChartJs, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'


ChartJs.register(ArcElement, Tooltip, Legend, LinearScale, BarElement, Title, CategoryScale)


const Barchart = ({ data }) => {
    const bardata = {
        labels: data.map(d => d.team),
        datasets: [
            {
                label: 'NRR Value',
                data: data.map(d => d.value),
                backgroundColor: [
                    'rgba(249, 205, 27, 0.8)', 'rgba(236, 28, 36, 0.8)', 'rgba(58, 34, 93, 0.8)', 
                    'rgba(0, 75, 160, 0.8)', 'rgba(255, 130, 42, 0.8)', 'rgba(237, 27, 36, 0.8)', 
                    'rgba(167, 32, 86, 0.8)', 'rgba(28, 28, 110, 0.8)'
                ],
                borderRadius: 12,
                borderSkipped: false,
                barThickness: 32,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 17, 23, 0.9)',
                padding: 12,
                cornerRadius: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 12 }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 12, weight: '600' }
                }
            }
        }
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Bar data={bardata} options={options} />
        </div>
    )
}

export default Barchart
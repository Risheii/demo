import { ArcElement, BarElement, CategoryScale, Chart as ChartJs, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'

ChartJs.register(ArcElement, Tooltip, Legend, LinearScale, BarElement, Title, CategoryScale)

const CharReactchart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.team),
        datasets: [
            {
                label: 'NRR Value',
                data: data.map(d => d.value),   
                backgroundColor: [
                    'rgba(249, 205, 27, 0.85)', 'rgba(236, 28, 36, 0.85)', 'rgba(58, 34, 93, 0.85)',
                    'rgba(0, 75, 160, 0.85)', 'rgba(255, 130, 42, 0.85)', 'rgba(237, 27, 36, 0.85)',
                    'rgba(167, 32, 86, 0.85)', 'rgba(28, 28, 110, 0.85)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { size: 12, weight: '500' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 17, 23, 0.9)',
                padding: 12,
                cornerRadius: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
            }
        },
        layout: {
            padding: 10
        }
    }

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '350px' }}>
            <Pie data={chartData} options={options} />
        </div>
    )
}

export default CharReactchart




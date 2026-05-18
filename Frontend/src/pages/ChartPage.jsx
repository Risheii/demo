import React from 'react'
import Chart from '../component/Chart'
import './ChartPage.css'

const ChartPage = () => {
    const data = [
        { "team": "CSK", "wins": 3 },
        { "team": "RCB", "wins": 6 },
        { "team": "KKR", "wins": 2 },
        { "team": "MI", "wins": 2 },
        { "team": "SRH", "wins": 5 },
        { "team": "RR", "wins": 6 },
        { "team": "PBKS", "wins": 6 },
        { "team": "DC", "wins": 3 },
        { "team": "GT", "wins": 3 },
        { "team": "LSG", "wins": 2 }
    ]

    const lossesData = [
        { "team": "CSK", "value": 5 },
        { "team": "RCB", "value": 2 },
        { "team": "KKR", "value": 6 },
        { "team": "MI", "value": 6 },
        { "team": "SRH", "value": 3 },
        { "team": "PBKS", "value": 1 },
        { "team": "LSG", "value": 6 },
        { "team": "GT", "value": 4 }
    ]

    const nrrData = [
        { team: 'CSK', value: 20 },
        { team: 'RCB', value: 25 },
        { team: 'KKR', value: 15 },
        { team: 'MI', value: 12 },
        { team: 'SRH', value: 10 },
        { team: 'PBKS', value: 12 },
        { team: 'LSG', value: 10 },
        { team: 'GT', value: 15 }
    ]

    return (
        <div className="chart-page-container">
            <Chart data={data} lossesData={lossesData} nrrData={nrrData} />
        </div>
    )
}

export default ChartPage
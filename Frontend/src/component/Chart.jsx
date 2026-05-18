// Chart.jsx
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CharReactchart from './CharReactchart';
import Barchart from './Barchart';
const COLORS = {
    CSK: "#F9CD1B",
    RCB: "#EC1C24",
    KKR: "#958f69ff",
    MI: "#004BA0",
    SRH: "#FF822A",
    RR: "#EA1A85",
    PBKS: "#ED1B24",
    DC: "#0078BC",
    GT: "#4d6977ff",
    LSG: "#566a98ff",
};

const RADIAN = Math.PI / 180;

const Chart = ({ data, lossesData, nrrData }) => {

    const isAnimationActive = false

    const renderCustomPieLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, name, value
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={11}
                fontWeight="bold"
                fill="#333"
            >
                <tspan>{name}</tspan>
                <tspan dx={4}>{value}</tspan>
            </text>
        );
    };


    return (
        <Container className="py-5 chart-page-inner">
            <Row className="justify-content-center mb-5">
                <Col xs={12}>
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                        <div className="bg-primary bg-gradient p-4 text-white text-center">
                            <h2 className="fw-bold mb-0">Recharts Visualization</h2>
                            <p className="opacity-75 mb-0">Dynamic team performance metrics</p>
                        </div>
                        <Card.Body className="p-lg-5 p-4">
                            <Row className="gy-4">
                                <Col xs={12} lg={6}>
                                    <Card className="h-100 border-0 bg-light bg-opacity-50 p-3" style={{ borderRadius: '20px' }}>
                                        <Card.Title className='text-center fs-4 mb-4 fw-bold text-secondary'>
                                            Win Distribution
                                        </Card.Title>
                                        <ResponsiveContainer height={450} width="100%">
                                            <PieChart>
                                                <Pie
                                                    dataKey="wins"
                                                    nameKey="team"
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius="80%"
                                                    labelLine={false}
                                                    label={renderCustomPieLabel}
                                                    isAnimationActive={true}
                                                    fill={(entry) => COLORS[entry.team]}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                                                    formatter={(value, name) => [`${value} wins`, name]}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>

                                <Col xs={12} lg={6}>
                                    <Card className="h-100 border-0 bg-light bg-opacity-50 p-3" style={{ borderRadius: '20px' }}>
                                        <Card.Title className='text-center fs-4 mb-4 fw-bold text-secondary'>
                                            Loss Distribution
                                        </Card.Title>
                                        <ResponsiveContainer width="100%" height={450}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    nameKey="team"
                                                    data={lossesData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius="80%"
                                                    labelLine={false}
                                                    label={renderCustomPieLabel}
                                                    isAnimationActive={isAnimationActive}
                                                    fill={(entry) => COLORS[entry.team]}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                                                    formatter={(value, name) => [`${value} losses`, name]}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="gy-5">
                <Col xs={12} lg={6}>
                    <Card className='border-0 shadow-sm overflow-hidden' style={{ borderRadius: '24px' }}>
                        <div className="bg-success bg-gradient p-3 text-white text-center">
                            <h4 className="fw-bold mb-0">NRR Pie Analysis</h4>
                        </div>
                        <Card.Body className="p-4">
                            <CharReactchart data={nrrData} />
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className='border-0 shadow-sm overflow-hidden' style={{ borderRadius: '24px' }}>
                        <div className="bg-info bg-gradient p-3 text-white text-center">
                            <h4 className="fw-bold mb-0">NRR Bar Comparison</h4>
                        </div>
                        <Card.Body className="p-4">
                            <Barchart data={nrrData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <Card className='border-0'>
                <Card.Title className="title text-center fs-2 pt-3">Column Chart</Card.Title>
                <Card.Body className="body">
                    <Column {...columnConfig} />
                </Card.Body>
            </Card>

            <Card className='border-0'>
                <Card.Title className="title text-center fs-2 pt-3">Bar Chart</Card.Title>
                <Card.Body className="body">
                    <Bar {...barConfig} />
                </Card.Body>
            </Card> */}

        </Container>
    );
}

export default Chart;
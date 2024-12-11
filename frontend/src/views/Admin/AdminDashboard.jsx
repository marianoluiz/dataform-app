import { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import '../../styles/admin.scss';
import { fetchStudentData } from '../../api/StudentApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartComponent, {
    chartOptions,
    ageLineOptions,
    citizenshipBarOptions,
    civilStatusBarOptions,
} from '../../components/ChartComponent.jsx';

const AdminDashboard = () => {
    const [studentData, setStudentData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0); // Use state for totalStudents
    const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
    const [citizenshipStats, setCitizenshipStats] = useState({});
    const [civilStatusStats, setCivilStatusStats] = useState({});
    const [ageStats, setAgeStats] = useState({});

    // Fetch student data
    useEffect(() => {
        const getStudentData = async () => {
            try {
                const data = await fetchStudentData();
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        getStudentData();
    }, []);

    // Calculate statistics
    useEffect(() => {
        const calculateStats = () => {
            const genderStats = { male: 0, female: 0 };
            const citizenshipStats = {};
            const civilStatusStats = {};
            const ageStats = {};

            studentData.forEach((student) => {
                // Gender stats
                if (student.gender === 'male') {
                    genderStats.male += 1;
                } else if (student.gender === 'female') {
                    genderStats.female += 1;
                }

                // Citizenship stats
                if (citizenshipStats[student.citizenship]) {
                    citizenshipStats[student.citizenship] += 1;
                } else {
                    citizenshipStats[student.citizenship] = 1;
                }

                // Civil status stats
                if (civilStatusStats[student.civil_status]) {
                    civilStatusStats[student.civil_status] += 1;
                } else {
                    civilStatusStats[student.civil_status] = 1;
                }

                // Age stats
                if (ageStats[student.age]) {
                    ageStats[student.age] += 1;
                } else {
                    ageStats[student.age] = 1;
                }
            });

            setGenderStats(genderStats);
            setCitizenshipStats(citizenshipStats);
            setCivilStatusStats(civilStatusStats);
            setAgeStats(ageStats);
            setTotalStudents(studentData.length);
        };

        calculateStats();
    }, [studentData]);

    // Gender - Pie Chart
    const genderPieData = {
        labels: ['Male', 'Female'], // Labels for each slice
        datasets: [
            {
                label: 'Gender Distribution',
                data: [genderStats.male, genderStats.female], // Values for each slice
                backgroundColor: ['#40BBD0', '#D040C9'], // Male: blue, Female: red
                hoverOffset: 4,
            },
        ],
    };

    // Horizontal Bar Graph Data for Civil Status
    const civilStatusBarData = {
        labels: Object.keys(civilStatusStats), // Civil status types (e.g., 'Single', 'Married')
        datasets: [
            {
                label: 'Civil Status',
                data: Object.values(civilStatusStats),
                backgroundColor: [
                    'rgb(75, 192, 192)', // Teal border for the first item
                    'rgb(255, 99, 132)', // Red border for the second item
                    'rgb(54, 162, 235)', // Blue border for the third item
                    'rgb(153, 102, 255)', // Purple border for the fourth item
                    'rgb(255, 159, 64)', // Orange border for the fifth item
                ],
                borderWidth: 1,
            },
        ],
    };

    // Citizenship - Bar Graph
    const citizenshipBarData = {
        labels: Object.keys(citizenshipStats), // Citizenship types (e.g., 'American', 'Filipino')
        datasets: [
            {
                label: 'Citizenship Types',
                data: Object.values(citizenshipStats), // Corresponding counts for each type
                backgroundColor: [
                    'rgb(255, 159, 64)', // Orange border for the fifth item
                    'rgb(54, 162, 235)', // Blue border for the third item
                    'rgb(75, 192, 192)', // Teal border for the first item
                    'rgb(255, 99, 132)', // Red border for the second item
                    'rgb(153, 102, 255)', // Purple border for the fourth item
                ],
                borderWidth: 0,
            },
        ],
    };

    // Age - Line Graph
    const ageLineData = {
        labels: Object.keys(ageStats), // X-axis labels (age groups)
        datasets: [
            {
                label: 'Age Data Graph', // Dataset label
                data: Object.values(ageStats), // Y-axis data corresponding to the labels
                fill: false, // Do not fill the area under the line
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1, // Smoothness of the line (lower value = less curve)
            },
        ],
    };

    // test
    useEffect(() => {
        console.log('student data: ', studentData);
        console.log('genderStats: ', genderStats);
        console.log('citizenshipStats: ', citizenshipStats);
        console.log('civilStatusStats: ', civilStatusStats);
        console.log('studentData.length: ', studentData.length);
    });

    return (
        <AdminLayout>
            <div className="admin__dashboard container">
                <div className="row">
                    {/* 1st col */}
                    <div className="col-sm-9 dashboard__col">
                        {/* 1st col, 1st row */}
                        <div className="row">
                            <div className="dashboard__col dashboard__total-stud col-sm-6">
                                <div className="card card__total-stud">
                                    <div className="card-body">
                                        <p className="card-text">
                                            Total number of students
                                        </p>
                                        <h1 className="card-title num__student">
                                            {totalStudents}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard__col col-sm-6">
                                <h1 className="dashboard__title">Dashboard</h1>
                            </div>
                        </div>
                        {/* 1st col, 2nd row */}
                        <div className="row">
                            {/* Bar graph horizontal, Civil Status */}
                            <div className="dashboard__col dashboard__civil col-sm-6 mt-3">
                                <div className="card">
                                    <div className="card-body civil__graph-wrapper">
                                        <ChartComponent
                                            className="civil__graph"
                                            type="bar"
                                            data={civilStatusBarData}
                                            options={civilStatusBarOptions}
                                        />
                                    </div>
                                </div>

                                {/*                                 <ul>
                                    {Object.entries(civilStatusStats).map(
                                        ([status, count]) => (
                                            <li key={status}>
                                                {status}: {count}
                                            </li>
                                        ),
                                    )}
                                </ul> */}
                            </div>
                            {/* Bar graph vertical, Citizenship Type */}
                            <div className="dashboard__col dashboard__citizen col-sm-6 mt-3">
                                <div className="card">
                                    <div className="card-body citizenship__graph-wrapper">
                                        <ChartComponent
                                            className="citizenship__graph"
                                            type="bar"
                                            data={citizenshipBarData}
                                            options={citizenshipBarOptions}
                                        />
                                    </div>
                                </div>

                                {/*                                 <ul>
                                    {Object.entries(citizenshipStats).map(
                                        ([citizenship, count]) => (
                                            <li key={citizenship}>
                                                {citizenship}: {count}
                                            </li>
                                        ),
                                    )}
                                </ul> */}
                            </div>
                        </div>

                        {/* 1st col, 3rd row */}
                        <div className="row">
                            <div className="dasboard__col dashboard__age col-sm-12  mt-3">
                                <div className="card">
                                    <div className="card-body age__graph-wrapper">
                                        <ChartComponent
                                            className="age__graph"
                                            type="line"
                                            data={ageLineData}
                                            options={ageLineOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd col */}
                    <div className="dashboard__col dashboard__gender col-sm-3">
                        <div className="card card__gender">
                            <p className="card-title pt-3 text-center">
                                Gender Pie Chart
                            </p>
                            <div className="card-body ">
                                <div className="gender__graph-wrapper">
                                    <ChartComponent
                                        className="gender__graph"
                                        type="pie"
                                        data={genderPieData}
                                        options={chartOptions}
                                    />
                                </div>

                                <ul className="list-unstyled text-center mt-5">
                                    <li className="mb-3">
                                        <h6 className="text-muted">
                                            Number of Male
                                        </h6>
                                        <p
                                            className="fs-4 mb-0 fw-bold"
                                            style={{ color: '#40BBD0' }}
                                        >
                                            {genderStats.male}
                                        </p>
                                    </li>
                                    <li className="mb-3">
                                        <h6 className="text-muted">
                                            Number of Female
                                        </h6>
                                        <p
                                            className="fs-4 mb-0 fw-bold"
                                            style={{ color: '#D040C9' }}
                                        >
                                            {genderStats.female}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

import Sidebar from "../sidebar";

const assignments = [
    {name: "Math Assignment 1", score: 85},
    {name: "Physics Assignment 2", score: 92},
];

export default function AssignmentScores() {
    return (
        <div className="flex min-h-screen bg-white text-black">
            <Sidebar/>
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Assignment Scores</h1>
                <div className="bg-gray-100 p-4 rounded-lg">
                    {assignments.map((assignment, index) => (
                        <div key={index} className="flex justify-between p-2 border-b">
                            <span>{assignment.name}</span>
                            <span className="font-bold">{assignment.score}%</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

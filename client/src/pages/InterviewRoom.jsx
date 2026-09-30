import { useParams } from 'react-router-dom';

function InterviewRoom() {
  const { type } = useParams();

  return (
    <div style={{ maxWidth: 700, margin: '60px auto' }}>
      <h2>Interview Room: {type}</h2>
      <p>This is where the AI interviewer will run. Coming in the next step.</p>
    </div>
  );
}

export default InterviewRoom;
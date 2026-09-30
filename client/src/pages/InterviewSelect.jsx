import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const INTERVIEW_TYPES = [
  { id: 'technical', label: 'Technical Round', description: 'Core CS concepts and role-specific technical questions' },
  { id: 'hr', label: 'HR Round', description: 'Behavioral and situational questions' },
  { id: 'aptitude', label: 'Aptitude Round', description: 'Logical reasoning and quantitative questions' },
  { id: 'coding', label: 'Coding Round', description: 'Live problem-solving and code explanation' },
];

function InterviewSelect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/interview/${type}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '60px auto' }}>
      <h2>Hi {user?.name}, choose your interview round</h2>
      <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        {INTERVIEW_TYPES.map((type) => (
          <div
            key={type.id}
            style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}
          >
            <h3>{type.label}</h3>
            <p>{type.description}</p>
            <button onClick={() => handleSelect(type.id)}>Start {type.label}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewSelect;